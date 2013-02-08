//Models for testing out Backbone Factory
window.Models = {
  User: Backbone.Model.extend({
    name: null,
    email: null
  }),
  Post: Backbone.Model.extend({
    defaults: {
      title: 'Default Title'
    }
  })
}
