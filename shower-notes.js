/**
 * @fileOverview
 * Presenter notes plugin for shower.
 */
shower.modules.define('shower-notes', [
    'util.extend'
], function (provide, extend) {

    var DEFAULT_NOTE_SELECTOR = 'footer';

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
        this._notesSelector = options.selector || DEFAULT_NOTE_SELECTOR;

        if (this._hasConsole()) {
            this._setupListeners();
        }
    }

    extend(Notes.prototype, /** @lends plugin.Notes.prototype */{
        destroy: function () {
            this._clearListeners();
            this._shower = null;
        },

        show: function () {
            this.clear();

            var shower = this._shower;
            var slide = shower.player.getCurrentSlide();
            var notes = slide.layout.getElement().querySelector(this._notesSelector);

            if (notes && notes.innerHTML) {
                console.info(notes.innerHTML.replace(/\n\s+/g, '\n'));
            }

            var currentSlideNumber = shower.player.getCurrentSlideIndex();
            var nextSlide = shower.get(currentSlideNumber + 1);

            if (nextSlide) {
                console.info('NEXT: ' + nextSlide.getTitle());
            }
        },

        clear: function () {
            var shower = this._shower;
            if (typeof console.clear !== 'undefined' &&
                shower.container.isSlideMode()) {
                console.clear();
            }
        },

        _hasConsole: function () {
            return typeof console !== 'undefined';
        },

        _setupListeners: function () {
            var shower = this._shower;

            this._showerListeners = shower.events.group()
                .on('destroy', this.destroy, this);

            this._playerListeners = shower.player.events.group()
                .on('activate', this._onSlideActivate, this);
        },

        _clearListeners: function () {
            if (!this._hasConsole()) {
                return;
            }
            this._showerListeners.offAll();
            this._playerListeners.offAll();
        },

        _onSlideActivate: function () {
            this.show();
        }
    });

    provide(Notes);
});

shower.modules.require(['shower'], function (sh) {
    sh.plugins.add('shower-notes');
});
