Ember.Object.extend({
  propWithMeta: Ember.computed('dk1', 'dk2', function() {
    return true;
  }).readOnly(),

  propWithMeta2: Ember.computed('dk1', 'dk2', function() {
    return true;
  }).meta({ type: Person }).readOnly().volatile()
});
