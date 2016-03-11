/*global define:false */
/**
 * Copyright 2014 Nigel Greenway
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * For use with Inuit CSS, this creates a Modal dialog for your project. Build
 * in vanilla Javascript, it allows you to not have to worry about any required
 * external dependencies.
 *
 * NOTE: Iglu has an optional dependancy of Mousetrap for optional key binding.
 * This will be installed if you installed IgluJS via Bower.
 * For more info visit: http://craig.is/killing/mice
 *
 * @version 0.0.1a
 * @url https://github.com/smilinmonki666/inuitcss.plugins.iglu
 */
(function(window, document, undefined) {
   /*
    * Show the container after it has been created
    */
    function show() {
        this.Iglu.container.style.display="block";
        this.Iglu.documentBody.className += ' ' + this.Iglu.documentBodyClassName;

        this.Iglu.container.getElementsByClassName('modal__close')[0].addEventListener('click', function() {
            destroy();
        });
        this.Iglu.container.addEventListener('click', function(event) {
            // Check it is the Iglu container that has triggered the event and
            // then allow for the Iglu object to be destroyed.
            if(this === event.target){
                destroy();
            }
        }, false);

        if (typeof Mousetrap !== 'undefined') {
            Mousetrap.bind('esc', function(e) {
                destroy();
            });
        };
    };

    /*
     * Destroy the container content and hide the container
     */
     function destroy() {
         this.Iglu.documentBody.className=this.Iglu.documentBody.className.replace(' ' + this.Iglu.documentBodyClassName, '');
         this.Iglu.container.style.display="none";
         this.Iglu.container.innerHTML="";

         if (typeof Mousetrap !== 'undefined') {
             Mousetrap.unbind('esc');
         }
     }

     // Factory methods:
     var factory = {
         /*
          * Create the Iglu modal and its content via the passed params
          */
          iglu: function(title, content, size, alignRight) {

              title = title === null ? '' : '<h1>' + title + '</h1>';

              Iglu.container.innerHTML=''+
              '<div class="modal__inner" size="' + size + '">' +
                  '<div class="modal__header">' +
                      '<span class="modal__close"></span>' +
                      title +
                  '</div>' +
                  '<div class="modal__body">' +
                      '<main class="modal__content">' + content + '</main>' +
                  '</div>' +
                  '<div class="modal__footer"></div>' +
              '</div>';

              return Iglu;
          },

         /*
          * Create a button with the details from the button object
          */
          button: function(button) {

              footer = Iglu.container.getElementsByClassName('modal__footer')[0];

              btn = document.createElement('button');

              if (typeof button.type === 'undefined') {
                  btn.setAttribute('type', 'button');
              } else {
                  btn.setAttribute('type', button.type);
              }

              alignRight = button.alignRight === false || typeof button.alignRight === 'undefined' ? '' : ' right';

              btn.setAttribute('class', button.class + ' ' + alignRight);

              btn.textContent=button.content;

              if (button.attr) {
                  Object.keys(button.attr).forEach(function(key) {
                      btn.setAttribute(button.attr[key].name, button.attr[key].value);
                  });
              }

              if (button.removeOnCallback === true) {
                  btn.addEventListener('click', function(event) {
                      event.target.parentNode.removeChild(event.target);
                  });
              }

              footer.appendChild(btn);

              if (button.dismiss === true) {
                  btn.addEventListener('click', function() {
                      destroy();
                  });
              }
          }
     };

     // Iglue Object
     var Iglu = {
         options:               null,
         container:             null,
         title:                 null,
         content:               null,
         documentBody:          null,
         documentBodyClassName: null,

        /*
         * Generator for the Iglu object.

         * @param string|null title
         * @param string      content
         * @param object      options
         */
         generate: function(title, content, options) {
             this.documentBody          = document.getElementsByTagName('body')[0];
             this.documentBodyClassName = 'modal--active';

             if (typeof title !== 'string' && title !== null) {
                 throw new TypeError('The `title` must be a String type.');
             }

             if (typeof content !== 'string') {
                 throw new TypeError('The `content` must be a String type.');
             }

             if (options === null) {
                 throw new TypeError('`options` must be an Object type.');
             }

             this.container = document.getElementById('modal');
             this.options   = options;

             factory.iglu(title, content, options.size, options.alignRight);

             Object.keys(options.buttons).forEach(function(key){
                 factory.button(options.buttons[key]);
             });

             show(this.container);

             return this;
         },

         notify: function(title, content) {

             var options = {
                 buttons: [
                     {
                         class:      'btn btn--primary',
                         content:    'Ok',
                         dismiss:    true,
                         alignRight: true
                     }
                 ],
                 size: 'notification'
             };

             this.generate(title, '<p>' + content + '</p>', options);
         },

        /*
         * Replace the content of the Iglu whilst the Iglu is active
         * @param string content
         */
         replaceContent: function(content) {
             this.container.getElementsByClassName('modal__content')[0].innerHTML=content;
         }
    };

    // expose Iglu as a global object
    window.Iglu = Iglu;

    // expose iglu as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(Iglu);
    }

}) (window, document);