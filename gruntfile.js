module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'public/stylesheets/main.css' : 'public/stylesheets/scss/main.scss'
        }
      }
    },
    watch: {
      css: {
        files: './public/stylesheets/scss/*.scss',
        tasks: ['sass'],
        options: {
          spawn : false
        }
      }
    },
  });


  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

};
