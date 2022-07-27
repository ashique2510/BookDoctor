var loadFile = function (event) {
    var image = document.getElementById("output");
    image.src = URL.createObjectURL(event.target.files[0]);

    // display image submit button when we click 
    document.getElementById("uploadImageBtn").style.display = "block";

  };

  

