/**
 * @fileOverview
 * Presenter notes plugin for shower.
 */
modules.define('shower-notes', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * Presenter notes plugin for shower.
     * @name plugin.Notes
     * @param {Shower} shower
     * @param {Object} [options] Plugin options.
     * @param {String} [options.selector = 'footer']
     * @constructor
     */
    function Notes (shower, options) {
        options = options || {};
        this._shower = shower;
        this._notesSelector = options.selector || 'footer';
    }

    extend(Notes.prototype, /** @lends plugin.Notes.prototype */{

        init: function () {
            if (typeof console != 'undefined') {
                this._setupListeners();
            }
        },

        destroy: function () {
            this.clear();
            this._clearListeners();
            this._shower = null;
        },

        show: function () {
            this.clear();

            var shower = this._shower,
                slide = shower.player.getCurrentSlide(),
                slideLayout = slide.getLayout(),
                notes = slideLayout.getElement().querySelector(this._notesSelector);

            if (notes && notes.innerHTML) {
                console.info(notes.innerHTML.replace(/\n\s+/g, '\n'));
            }

            var currentSlideNumber = shower.player.getCurrentSlideIndex(),
                nextSlide = shower.get(currentSlideNumber + 1);

            if (nextSlide) {
                console.info('NEXT: ' + nextSlide.getTitle());
            }
        },

        clear: function () {
            var shower = this._shower;
            if (typeof console.clear != 'undefined' &&
                shower.container.isSlideMode() &&
                !shower.options.debug) {

                console.clear();
            }
        },

        _setupListeners: function () {
            var shower = this._shower;

            this._showerListeners = shower.events.group()
                .on('destroy', this.destroy, this);

            this._playerListeners = shower.player.events.group()
                .on('activate', this._onSlideActivate, this);
        },

        _clearListeners: function () {
            this._showerListeners.offAll();
            this._playerListeners.offAll();
        },

        _onSlideActivate: function () {
            this.show();
        }
    });

    provide(Notes);
});

modules.require(['shower'], function (shower) {
    shower.plugins.add('shower-notes');
});
