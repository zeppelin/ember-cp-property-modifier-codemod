Ember.Object.extend({
  propWithMeta: function() {
    return true;
  }.property('dk1', 'dk2').readOnly(),

  propWithMeta2: function() {
    return true;
  }.property('dk1', 'dk2').meta({ type: Person }).readOnly().volatile()
});
