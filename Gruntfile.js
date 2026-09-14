module.exports = function (grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          implementation: require("sass"),
          sourceMap: true,
        },
        files: [
          {
            expand: true,
            cwd: "css", // carpeta donde están tus .scss
            src: ["*.scss"], // todos los archivos .scss
            dest: "css", // donde se guardarán los .css
            ext: ".css",
          },
        ],
      },
    },

    watch: {
      sass: {
        files: ["css/*.scss"], // archivos a vigilar
        tasks: ["sass"], // tarea que se ejecuta
      },
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            "css/*.css", // archivos CSS compilados
            "*.html", // tus archivos HTML
            "js/*.js", // si tienes JavaScript
          ],
        },
        options: {
          watchTask: true,
          server: {
            baseDir: "./", // carpeta raíz de tu proyecto
          },
           startPath: "dashboard.html"
        },
      },
    },
  });
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-browser-sync");

  // Tarea principal
  grunt.registerTask("default", ["sass", "browserSync", "watch"]);
};