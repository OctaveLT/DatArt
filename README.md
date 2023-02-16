# DatArt <img alt="logo of DatArt" src="/public/datArtLogo.svg" width="23" />


DatArt is a project in Vue.js aiming to transform your video souvenirs into art pictures. Remind your favorite videos through abstract and colorful shapes!

![Overall interface](/public/interface.PNG)

**It is easy and intuitive: Upload your video and the magic happens!**
> Choose a video memory, the calculation is made in real-time, change the settings as you feel it, and download the final shape ;)

## Shapes

Various colors are collected by the algorithm from your videos, they are then being shaped in 3 different shapes:

*Circle/Donut*: Put the retrieved colors in a shape of a circle sorted in time order.

<img style="float: right;" alt="circle shape example" src="/public/circle2.PNG" width="100" />

*Lines*: The colors are stacked up in lines sorted in time order from top to bottom.

<img alt="lines shape example" src="/public/lines.PNG" width="100" />

*Rose*: The computed colors are in a multiple lines shape with a specific angle which makes it look like a rose.

<img alt="rose shape example" src="/public/rose.PNG" width="100" />

## Settings

The 3 different shapes can be tuned thanks to the settings top-bar.

You are now able to change: 

- The *color amount threshold*.
- The *background color* of the canvas.
- The *inside and outside radius* of the circle shape.
- The *angle of the lines* shape.
- And even the *width of the rose* shape!
> Further improvements are coming soon ;)

