      bodyPlain: (function (entry) {
        var result = entry.content
          .replace(/<script[\\r\\\s\S]*<\/script>/mgi, '')
          .replace(/<\/?[^>]+>/gi, '');

        for (var i = 0; i < RSS.htmlTags.length; i++) {
          result = result.replace(new RegExp('<' + RSS.htmlTags[i], 'gi'), '');
        }

        return result;
      })(entry),

      shortBodyPlain: entry.contentSnippet.replace(/<\/?[^>]+>/gi, ''),
      index:          $.inArray(entry, this.entries),
      totalEntries:   this.entries.length,

      teaserImage:    (function (entry) {
        try {
          return entry.content.match(/(<img.*?>)/gi)[0];
        }
        catch (e) {
          return '';
        }
      })(entry),

      teaserImageUrl: (function (entry) {
        try {
          return entry.content.match(/(<img.*?>)/gi)[0].match(/src="(.*?)"/)[1];
        }
        catch (e) {
          return '';
        }
      })(entry)
    }, this.options.tokens);
  };

  RSS.prototype.getValueForToken = function (_token, entry) {
    var tokenMap = this.getTokenMap(entry);
    var token    = _token.replace(/[\{\}]/g, '');
    var result   = tokenMap[token];

    if (typeof result !== 'undefined') {
      return ((typeof result === 'function') ? result(entry, tokenMap) : result);
    } else {
      throw new Error('Unknown token: ' + _token + ', url:' + this.url);
    }
  };

  $.fn.rss = function (url, options, callback) {
    new RSS(this, url, options, callback).render();
    return this; // Implement chaining
  };
})(jQuery);
