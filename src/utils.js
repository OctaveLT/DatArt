import { computed, onMounted, onUnmounted, reactive } from "vue"

export const hex2rgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return [parseInt(result[1], 16), 
            parseInt(result[2], 16), 
            parseInt(result[3], 16)]
  }

export const rgb2hsl = function(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    var max = Math.max(r, g, b)
    var min = Math.min(r, g, b)
    var lum = (max + min) / 2
    var c = max - min
    var hue
    var sat
    if (c == 0) {
      hue = 0
      sat = 0
    } else {
        // saturation is simply the chroma scaled to fill
        // the interval [0, 1] for every combination of hue and lightness
        sat = c / (1 - Math.abs(2 * lum - 1))
        switch(max) {
            case r:
            var segment = (g - b) / c
            var shift   = 0 / 60;      // R° / (360° / hex sides)
            if (segment < 0) {          // hue > 180, full rotation
                shift = 360 / 60;        // R° / (360° / hex sides)
            }
            hue = segment + shift
            break;
            case g:
            var segment = (b - r) / c
            var shift   = 120 / 60;    // G° / (360° / hex sides)
            hue = segment + shift
            break;
            case b:
            var segment = (r - g) / c
            var shift   = 240 / 60    // B° / (360° / hex sides)
            hue = segment + shift
            break;
        }
    }
    return [hue * 60, sat * 100, lum * 100] // hue is in [0,6], scale it up
  }

export const hsl2rgb = function(h, s, l){
    h /= 360
    s /= 100
    l /= 100
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

//ex: [R, G, B] -> R-G-B, [10, 30, 250] -> 10-30-250
export const color2string = (color) => {
    return `${color[0]}-${color[1]}-${color[2]}` 
}

//reverse function of color2string
export const string2color = (string) => {
    return string.split('-') 
}

/* export function colorDistance(color1, color2) {
    var result = 0;
    for (var i = 0; i < color1.length; i++)
        result += (color1[i] - color2[i]) * (color1[i] - color2[i]);
    return result;
} */

function colorDistance(color1, color2, balance) {
    var result = 0
    color1 = rgb2hsl(color1[0], color1[1], color1[2])
    color2 = rgb2hsl(color2[0], color2[1], color2[2])
    for (var i = 0; i < color1.length; i++)
        result += (color1[i] - color2[i]) * (color1[i] - color2[i]) * balance[i]
    return result
}

export function sortColors(colors, balance) {
    // Calculate distance between each color
    var distances = []
    for (var i = 0; i < colors.length; i++) {
        distances[i] = []
        for (var j = 0; j < i; j++)
            distances.push([colors[i], colors[j], colorDistance(colors[i], colors[j], balance)])
    }
    distances.sort(function(a, b) {
        return a[2] - b[2]
    });

    // Put each color into separate cluster initially
    var colorToCluster = {}
    var colorOccurences = {}

    for (var i = 0; i < colors.length; i++) {
        colorToCluster[colors[i]] = [colors[i]]

        if (colorOccurences[colors[i]]) {colorOccurences[colors[i]]++}
        else {colorOccurences[colors[i]] = 1}
    }

    // Merge clusters, starting with lowest distances
    var lastCluster
    for (var i = 0; i < distances.length; i++) {
        var color1 = distances[i][0]
        var color2 = distances[i][1]
        var cluster1 = colorToCluster[color1]
        var cluster2 = colorToCluster[color2]
        if (!cluster1 || !cluster2 || (cluster1 == cluster2 && cluster1.length > 1 && cluster2.length > 1))
            continue

        // Make sure color1 is at the end of its cluster and
        // color2 at the beginning.
        if (color1 != cluster1[cluster1.length - 1])
            cluster1.reverse()
        if (color2 != cluster2[0])
            cluster2.reverse()

        // Merge cluster2 into cluster1
        cluster1.push.apply(cluster1, cluster2)
        delete colorToCluster[color1]
        delete colorToCluster[color2]
        colorToCluster[cluster1[0]] = cluster1
        colorToCluster[cluster1[cluster1.length - 1]] = cluster1
        lastCluster = cluster1
    }

    // By now all colors should be in one cluster
    return [lastCluster, colorOccurences]
}

export const useBreakpoints = (ratio) => {
  const windowSize = reactive({ h: window.innerHeight, w: window.innerWidth })

    const onResize = () => {
        windowSize.h = window.innerHeight
        windowSize.w = window.innerWidth
    }

    onMounted(() => {
        window.addEventListener("resize", onResize)
    })

    onUnmounted(() => {
        window.removeEventListener("resize", onResize)
    })

    const width = computed(() => windowSize.w * ratio)
  
    return width
}

export const useIsMobileVersion = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}