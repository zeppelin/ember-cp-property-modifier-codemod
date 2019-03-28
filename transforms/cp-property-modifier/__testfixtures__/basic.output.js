Ember.Object.extend({
  showGroupAvatar: Ember.computed('thread.isGroupChat', 'thread.isEventChat', function() {
    return this.get('thread.isGroupChat') || this.get('thread.isEventChat');
  }),

  showMiniProfile: Ember.computed('isSingleUserChat', 'withMiniProfile', 'isInTopMenu', function() {
    return (this.get('isSingleUserChat') || this.get('withMiniProfile')) && !this.get('isInTopMenu');
  }),
});
