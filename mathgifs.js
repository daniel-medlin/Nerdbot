const NRicon = "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png";  //Nerd Revolt Icon for embeds.
const embedColor = 4194099; //color code for embeds.

exports.selection = function select(MathNum){
    var giffyBois = [ "http://i.imgur.com/QjI3a5N.gif","http://i.imgur.com/UM4iYce.gif","http://i.imgur.com/ptJ6Ph6.gif",
    "http://i.imgur.com/sYgj4HS.gif","http://i.imgur.com/16Afrj1.gif","http://i.imgur.com/O9W3KCz.gif","http://i.imgur.com/bZDfWVr.gif",
    "http://i.imgur.com/vVcc2OP.gif","http://i.imgur.com/AQUrYb1.gif","http://i.imgur.com/WheKCzG.gif","http://i.imgur.com/cBzeLOo.gif",
    "http://i.imgur.com/ZJ7H3Zw.gif","http://i.imgur.com/7sNvJ9c.gif","http://i.imgur.com/SEDLpsd.gif","http://i.imgur.com/wEbNVxU.gif",
    "http://i.imgur.com/WrdyKdG.gif","http://i.imgur.com/YCnwxZJ.gif","http://i.imgur.com/S7FJlZi.gif","http://i.imgur.com/kmh3hR5.gif",
    "http://i.imgur.com/bsIyErA.gif","http://i.imgur.com/Dc1OkwU.gif"

    ]

    return giffyBois[MathNum-1];
}
exports.options = function display(channel){
    var embed = {
        "description": "Below you'll find the options available for math gifs.  Just respond with a number or cancel",
        "url": "https://discordapp.com",
        "color": embedColor,
        "thumbnail": {
          "url": NRicon
        },
        "author": {
          "name": "Math Gifs",
          "icon_url": NRicon
        },
        "fields": [
          {
            "name": "Available Options",
            "value": "\
            1:  How to draw an ellipse. \n\
            2:  Solving pascal triangles. \n\
            3:  Using FOIL to multiply binomials. \n\
            4:  How to solve logarithms. \n\
            5:  Matrix transpositions. \n\
            6:  What the Pythagorean Theorem is really trying to show you. \n\
            7:  Exterior angles of polygons will ALWAYS add up to 360 degrees. \n\
            8:  Visualization of Pi. \n\
            9:  Radians.\n\
            10:  Visualizing sine (red) on the Y axis and cosine (blue) on the X axis. The relative position of the circle is shown in black.\n\
            11:  Same as 10, 2d.\n\
            12:  SIN and COS for triangles.\n\
            13:  COS is derivative of SIN.\n\
            14:  Tangent lines\n\
            15:  Tangent lines (side view)\n\
            16:  Cartesian to polar coords.\n\
            17:  Draw a parabola.\n\
            18:  Riemann sum is ~ area of a curve.\n\
            19:  Hyperbola\n\
            20:  3d Hyperbola - Made with straight lines.\n\
            21:  Hyperbola video."
          }
        ]
      };
      channel.send({ embed });
      //return embed;
}