/**
 * Notifycation
 */
class Notifycation {
    /**
     * creat Prompt
     * @param submit
     * @returns {{theme: string, title: string, boxWidth: string, useBootstrap: boolean, content: string, buttons: {formSubmit: {text: string, btnClass: string, action: *}, cancel: buttons.cancel}}}
     */
    static creatPrompt(submit) {
        let html =
            '<div id="reportForm"> <div class="wrapper" > <form> <div class="group"> <input id="name" type="text" required="required"/><span class="highlight"></span><span class="bar"></span> <label>Name</label> </div> <div class="group"> <input id="email" type="text" required="required"/><span class="highlight"></span><span class="bar"></span> <label>Email FUNiX</label> </div> <div class="group"> <textarea id="message" type="textarea" rows="5" required="required"></textarea><span class="highlight"></span><span class="bar"></span> <label>Message</label> </div> </form> </div> </div>'
        return {
            theme: 'modern',
            title: 'FUNiX Passport',
            boxWidth: '750px',
            useBootstrap: false,
            content: html,
            buttons: {
                formSubmit: {
                    text: 'Submit',
                    btnClass: 'btn-blue',
                    action: submit
                },
                cancel: function () {
                },
            }
        };
    }

    /**
     * create Loading Ajax
     * @param action
     * @returns {{title: string, closeIcon: boolean, boxWidth: string, useBootstrap: boolean, content: *}}
     */
    static creatLoadingAjax(action) {
        return {
            title: '',
            closeIcon: false,
            boxWidth: '500px',
            useBootstrap: false,
            content: action
        };
    }

    /**
     * notify
     * @param text
     */
    static notify(text) {
        $.alert({
            title: 'Alert!',
            content: text,
            boxWidth: '500px',
            useBootstrap: false,
            closeIcon: true,
        });
    }

    /**
     * confirm Subtitle
     * @param arraySubTitle
     * @returns {Promise<any>}
     */
    static confirmSubtitle(arraySubTitle = []) {
        console.log(arraySubTitle);
        return new Promise(function (resolve, reject) {
            $.alert({
                icon: '',
                theme: 'modern',
                title: 'FUNiX Passport',
                content: "This page already has subtitles support, which language do you want to translate?",
                boxWidth: '500px',
                useBootstrap: false,
                buttons: {
                    vi: {
                        text: 'Viet sub',
                        action: function () {
                            resolve(1);
                        }
                    },

                    audio_vi: {
                        text: 'Viet sub + audio ',
                        action: function () {
                            resolve(4);
                        }
                    },
                    // eng: {
                    //    text: 'English',
                    //    action: function() {
                    //       resolve(2);
                    //    }
                    // },

                    jp: {
                        text: 'Japanese sub',
                        action: function () {
                            resolve(3);
                        }
                    },

                    audio_jp: {
                        text: 'Japanese sub + audio',
                        action: function () {
                            resolve(5);
                        }
                    },

                    off: {
                        text: 'Keep original',
                        action: function () {
                            resolve(0);
                        }
                    }
                }
            });
        });
    }

    /**
     * confirm Page Translate
     * @returns {Promise<any>}
     */
    static confirmPageTranslate() {
        return new Promise(function (resolve, reject) {
            $.alert({
                icon: '',
                theme: 'modern',
                title: 'FUNiX Passport',
                content: "This page already has translate support, would you like to enable it?",
                boxWidth: '500px',
                useBootstrap: false,
                buttons: {
                    vi: {
                        text: 'Vietnamese',
                        action: function () {
                            resolve(1);
                        }
                    },
                    jp: {
                        text: 'Japanese',
                        action: function () {
                            resolve(2);
                        }
                    },
                    No: {
                        text: 'Cancel',
                        action: function () {
                            resolve(3);
                        }
                    }
                }
            });
        });
    }
}
