
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
        sass: {
            options: {
                implementation: require('node-sass'),
                sourceMap: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'public/scss',
                    src: ['*.scss'],
                    dest: 'public/css',
                    ext: '.css'
                }]
            }
        },
        watch: {
            css: {
                files: ["public/css/*.css"],
                tasks: ["concat", "cssmin"]
            },
            scss: {
                files: ["public/scss/*.scss"],
                tasks: ["sass"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['concat', 'cssmin', 'sass', 'watch']);
}