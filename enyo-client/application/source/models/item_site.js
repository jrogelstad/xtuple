/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.CostCategory = XM.Document.extend(/** @lends XM.CostCategory.prototype */{

    recordType: 'XM.CostCategory',

    documentKey: "code"

  });

  /**
    @class

    @extends XM.Document
  */
  XM.PlannerCode = XM.Document.extend(/** @lends XM.PlannerCode.prototype */{

    recordType: 'XM.PlannerCode',

    documentKey: "code"

  });


  /**
    @class

    @extends XM.Document
  */
  XM.ItemSite = XM.Document.extend(/** @lends XM.ItemSite.prototype */{

    recordType: 'XM.ItemSite',

    defaults: {
      isActive: true
    }

  });

  /**
    @class

    @extends XM.Comments
  */
  XM.ItemSiteComment = XM.Comment.extend(/** @lends XM.ItemSiteComment.prototype */{

    recordType: 'XM.ItemSiteComment',

    sourceName: 'IS'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ItemSiteRelation = XM.Info.extend(/** @lends XM.ItemSiteRelation.prototype */{

    recordType: 'XM.ItemSiteRelation',

    editableModel: 'XM.ItemSite',

    numberSite: function () {
      return this.getValue("item.number") + " " + this.getValue("site.code");
    }
  });


  /**
    @class

    @extends XM.Info
  */
  XM.ItemSiteListItem = XM.Info.extend(/** @lends XM.ItemSiteListItem.prototype */{

    recordType: 'XM.ItemSiteListItem',

    editableModel: 'XM.ItemSite'

  });

  _.extend(XM.ItemSiteListItem, /** @lends XM.ItemSiteListItem# */{
    /**
      Item site has no searchable attributes by default, so we have to provide some, or
      errors occur (e.g. the search screen)
     */
    getSearchableAttributes: function () {
      return ["item.number", "site.code"];
    }
  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.CostCategoryCollection = XM.Collection.extend(/** @lends XM.CostCategoryCollection.prototype */{

    model: XM.CostCategory

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.PlannerCodeCollection = XM.Collection.extend(/** @lends XM.PlannerCodeCollection.prototype */{

    model: XM.PlannerCode

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteCollection = XM.Collection.extend(/** @lends XM.ItemSiteCollection.prototype */{

    model: XM.ItemSite

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteRelationCollection = XM.Collection.extend(/** @lends XM.ItemSiteRelationCollection.prototype */{

    model: XM.ItemSiteRelation,

    fetch: function (options) {
      var that = this,
        success;

      if (!this.bespokeFilter || this.bespokeFilter === {}) {
        // just do a normal fetch
        XM.Collection.prototype.fetch.call(this, options);
      } else {
        // we have to do a special dispatch to fetch the data.

        // because it's a dipatch call and not a fetch, the collection doesn't get
        // updated automatically. We have to do that by hand on success.
        success = options.success;
        options.success = function (data) {
          that.reset(data);

          if (success) {
            success(data);
          }
        };

        XT.dataSource.dispatch("XM.Item", "availableItems",
          [options.query,
            this.bespokeFilter.customerId,
            this.bespokeFilter.shiptoId,
            this.bespokeFilter.effectiveDate || new Date()],
          options);
      }
    }

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteListItemCollection = XM.Collection.extend(/** @lends XM.ItemSiteListItemCollection.prototype */{

    model: XM.ItemSiteListItem

  });

}());
