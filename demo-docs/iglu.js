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
 *
 *
 * For use with Inuit CSS, this creates a Modal dialog for your project. Build
 * in vanilla Javascript, it allows you to not have to worry about any required
 * external dependencies.
 *
 * NOTE: Iglu has an optional dependancy of Mousetrap for otpional key binding.
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

        this.Iglu.container.getElementsByClassName('close')[0].addEventListener('click', function() {
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
    };

    // Factory methods:
    var factory = {
        /*
         * Create the Iglu and its content via the passed params
         */
         iglu: function(title, content, size, alignRight) {

            title = title === null ? '' : '<h1>' + title + '</h1>';

            // Todo: Should this be a series of doc.createElement()??
            Iglu.container.innerHTML='<div class="iglu__hut" size="' + size + '">' +
            '<div class="iglu__hut--body">' +
            '<span class="close">&#10006;</span>' +
            title +
            '<main class="iglu__hut--content">' + content + '</main>' +
            '</div>' +
            '<footer class="iglu__hut--footer"></footer>' +
            '</div>';

            return Iglu;
        },

        /*
         * Create a button with the details from the button object
         */
         button: function(button) {

            footer = Iglu.container.getElementsByClassName('iglu__hut--footer')[0];

            btn = document.createElement('button');

            if (typeof button.type === 'undefined') {
                btn.setAttribute('type', 'button');
            } else {
                btn.setAttribute('type', button.type);
            };

            alignRight = button.alignRight === false || typeof button.alignRight === 'undefined' ? '' : ' right';

            switch (button.style) {
                case 'default':
                btn.setAttribute('class', 'btn' + alignRight);
                break;
                case 'submit':
                case 'primary':
                btn.setAttribute('class', 'btn btn--primary' + alignRight);
                break;
                case 'warning':
                btn.setAttribute('class', 'btn btn--warning' + alignRight);
                break;
                case 'danger':
                case 'cancel':
                btn.setAttribute('class', 'btn btn--danger' + alignRight);
                break;
            }

            btn.textContent=button.content;

            if (button.attr) {
                Object.keys(button.attr).forEach(function(key) {
                    btn.setAttribute(button.attr[key].name, button.attr[key].value);
                });
            };

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
            };
        }
    }

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
            this.documentBodyClassName = 'active-iglu';

            if (typeof title !== 'string' && title !== null) {
                throw new TypeError('The `title` must be a String type.');
            }

            if (typeof content !== 'string') {
                throw new TypeError('The `content` must be a String type.');
            }

            if (options === null) {
                throw new TypeError('`options` must be an Object type.');
            };

            this.container = document.getElementById('iglu');
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
                    style:      'primary',
                    content:    'Ok',
                    dismiss:    true,
                    alignRight: true
                }
                ],
                size: 'notification'
            }

            this.generate(title, '<p>' + content + '</p>', options);
        },

        /*
         * Replace the content of the Iglu whilst the Iglu is active
         * @param string content
         */
         replaceContent: function(content) {
            this.container.getElementsByClassName('iglu__hut--content')[0].innerHTML=content;
        }
    };

    // expose Iglu as a global object
    window.Iglu = Iglu;

    // expose iglu as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(Iglu);
    }

}) (window, document);