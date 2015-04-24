'use strict';

var
  LIVERELOAD_PORT = 35729,
  lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
  }),
  proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest,
  mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');

  grunt.initConfig({
    watch: {
      livereload: {
        files: [
          '{,*/}*.html',
          '{,*/}*.js',
          '{,*/}*.css'
        ],
        options: {
          livereload: LIVERELOAD_PORT
        }
      }
    },
    connect: {
      options: {
        port: 81,
        hostname: '0.0.0.0',
        logger: 'dev'
      },
      proxies: [       
        {
          context: '/billing',
          host: 'localhost',
          port: 81,
          rewrite: {
            '/billing': '/app'
          }
        }, 

        {
          context: '/api/billing/history/pippo',
          host: 'localhost',
          port: 1337,
          https: false,
          changeOrigin: false
        }
      ],
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              proxySnippet,
              lrSnippet,
              mountFolder(connect, './'),
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>/tabAce.html'
      }
    }
  });

  grunt.registerTask('server', function() {
    grunt.task.run([
      'configureProxies:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('default', ['server']);
};