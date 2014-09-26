/*
 * Copyright 2013 - Gulfaraz Yasin
 * gulfaraz.com
 *
 * jQuery Plugin - Scrolling Text Version 1 - scrolling-text.js
 *
 * Usage(Default Values):
 $(selector).scrollingtext({
 'height': 700,
 'width': 900,
 'fadeTop': 50,
 'fadeBottom': 50,
 'fadeTopColor': '#ffffff',
 'fadeBottomColor': '#ffffff'
 });
 */

(function($) {

    $.fn.scrollingtext = function(custom_configuration) {

        if ($(this).length > 0) {

            if (!custom_configuration) {
                custom_configuration = {};
            }

            if (custom_configuration.height) {
                $(this).css('height', 'auto');
            } else {
                var css_height = $(this).outerHeight();
                var auto_height = $(this).css('height', 'auto').outerHeight();
                if (css_height !== auto_height) {
                    custom_configuration.height = css_height;
                }
            }

            if (custom_configuration.width) {
                $(this).css('width', 'auto');
            } else {
                var css_width = $(this).outerWidth();
                var auto_width = $(this).css('width', 'auto').outerWidth();
                if (css_width !== auto_width) {
                    custom_configuration.width = css_width;
                }
            }

            var configuration = $.extend({}, $.fn.scrollingtext.default_configuration, custom_configuration);
            var gradientPrefix = getCssValuePrefix('backgroundImage', 'linear-gradient(left, #fff, #fff)');

            top_rgb = any2rgb(configuration.fadeTopColor);
            bottom_rgb = any2rgb(configuration.fadeBottomColor);

            element = $(this)[0].tagName.toLowerCase();
            if ($(this).attr('class')) {
                element += '.' + $(this).attr('class').toLowerCase();
            }
            if ($(this).attr('id')) {
                element += '#' + $(this).attr('id').toLowerCase();
            }

            error_mapping = {
                'fadeTopColor': [(top_rgb === 0), 'The accepted color values are of the type rgb(255, 255, 255), #ffffff, #fff and white.', configuration.fadeTopColor],
                'fadeBottomColor': [(bottom_rgb === 0), 'The accepted color values are of the type rgb(255, 255, 255), #ffffff, #fff and white.', configuration.fadeBottomColor],
                'height': [isNaN(configuration.height), 'Any number greater than 0 is acceptable. Eg. \'700\', 700px and \'700px\' are invalid; 700 is an valid input.', configuration.height],
                'width': [isNaN(configuration.width), 'Any number greater than 0 is acceptable. Eg. \'900\', 900px and \'900px\' are invalid; 900 is an valid input.', configuration.width],
                'fadeTop': [isNaN(configuration.fadeTop), 'Any number greater than 0 is acceptable. Eg. \'50\', 50px and \'50px\' are invalid; 50 is an valid input.', configuration.fadeTop],
                'fadeBottom': [isNaN(configuration.fadeBottom), 'Any number greater than 0 is acceptable. Eg. \'50\', 50px and \'50px\' are invalid; 50 is an valid input.', configuration.fadeBottom]
            };

            for (var key in error_mapping) {
                i = 0;
                if (error_mapping[key][0]) {
                    if (i === 0) {
                        console.group('Invalid scrolling text plugin configuration for ' + element);
                    }
                    console.error($(element), key + ': ' + error_mapping[key][2] + ' -- ' + error_mapping[key][1]);
                    i++;
                }
                if (i > 0) {
                    console.groupEnd();
                    return;
                }
            }

            top_rgba1 = rgb2rgba(top_rgb, '1');
            top_rgba0 = rgb2rgba(top_rgb, '0');
            bottom_rgba1 = rgb2rgba(bottom_rgb, '1');
            bottom_rgba0 = rgb2rgba(bottom_rgb, '0');

            return this.each(function() {

                $(this).append($('<div>').addClass('scrollingtext-before')).append($('<div>').addClass('scrollingtext-after'));
                $(this).wrap('<section class="scrollingtext-article"><div class="scrollingtext-scroll_bar_fix"><div class="scrollingtext-content"></div></div></section>');

                $('div.scrollingtext-before, div.scrollingtext-after').css({'width': '100%', 'position': 'absolute', 'left': '0px'});
                $('div.scrollingtext-before').css('top', '0px');
                $('div.scrollingtext-after').css('bottom', '0px');

                $(this).closest('section.scrollingtext-article').css({'height': configuration.height + 'px', 'width': configuration.width + 'px', 'overflow-x': 'hidden', 'position': 'relative'});
                $(this).closest('div.scrollingtext-content').css({'width': configuration.width + 'px'});
                $(this).closest('div.scrollingtext-scroll_bar_fix').css({'width': (configuration.width + 50) + 'px', 'max-height': (configuration.height - 10) + 'px', 'overflow-x': 'hidden', 'overflow-y': 'scroll'});

                if (($(this).height() - $(this).closest('div.scrollingtext-scroll_bar_fix').height()) > 0) {

                    $(this).children('div.scrollingtext-before').css({
                        'height': '0px',
                        'background': gradientPrefix + 'linear-gradient(top,  ' + top_rgba1 + ' 0%, ' + top_rgba0 + ' 100%)'
                    });

                    $(this).children('div.scrollingtext-after').css({
                        'height': '0px',
                        'background': gradientPrefix + 'linear-gradient(top,  ' + bottom_rgba0 + ' 0%, ' + bottom_rgba1 + ' 100%)'
                    }).animate({height: configuration.fadeBottom + 'px'}, 1000);

                    $(this).closest('div.scrollingtext-scroll_bar_fix').each(function() {

                        var maximum_scroll = $(this)[0].scrollHeight - $(this)[0].offsetHeight;

                        $(this).scroll(function() {
                            var current_scroll = $(this).scrollTop();
                            if (current_scroll < configuration.fadeTop) {
                                $(this).find('div.scrollingtext-before').height(current_scroll);
                            } else if (current_scroll > (maximum_scroll - configuration.fadeBottom)) {
                                $(this).find('div.scrollingtext-after').height(maximum_scroll - current_scroll);
                            } else {
                                $(this).find('div.scrollingtext-before, div.scrollingtext-after').fadeIn(300);
                            }
                        });
                    });
                }
            });
        }
    };

    $.fn.scrollingtext.default_configuration = {
        'height': 700,
        'width': 900,
        'fadeTop': 50,
        'fadeBottom': 50,
        'fadeTopColor': '#ffffff',
        'fadeBottomColor': '#ffffff'
    };

    function any2rgb(any) {

        $('body').append('<div class="temp-color" style="display: none"></div>');
        $('div.temp-color').css('color', 'white');
        $('div.temp-color').css({
            'color': any,
            'background-color': any
        });
        if (any && ($('div.temp-color').css('color') === $('div.temp-color').css('background-color') || any === 'white')) {
            rgb = $('div.temp-color').css('color');
        } else {
            rgb = 0;
        }
        $('div.temp-color').remove();
        return rgb;
    }

    function rgb2rgba(rgb, a) {
        return rgb.replace(/\)([^\)]*)$/, ', ' + a + '$1)').replace(/rgb([^rgb]*)$/, 'rgba$1');
    }

    function getCssValuePrefix(name, value) {
        //Thank you to Matt - http://stackoverflow.com/users/1306809/matt-coughlin
        var prefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
        var prefix = '';

        var dom = document.createElement('div');

        for (var i = 0; i < prefixes.length; i++) {
            dom.style[name] = prefixes[i] + value;
            if (dom.style[name])
                prefix = prefixes[i];
            dom.style[name] = '';
        }
        return prefix;
    }

})(jQuery);
