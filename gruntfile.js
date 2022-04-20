
module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: ["public/css/*.css"],
                dest: "public/stylesheets/style.css"
            }
        },
        cssmin: {
            target: {
                files: {
                    'public/stylesheets/style.min.css': ['public/stylesheets/style.css']
                }
            }
        },
        watch: {
            css: {
                files: ["public/css/*.css"],
                tasks: ["concat", "cssmin"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['concat', 'cssmin', 'watch']);
}