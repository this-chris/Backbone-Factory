// Backbone Factory JS
// https://github.com/SupportBee/Backbone-Factory

(function(){
  window.BackboneFactory = {

    factories: {},
    sequences: {},

    define: function(factory_name, klass, defaults){
      var factory_name_id = "_"+ factory_name +"_id";

      // Check for arguments' sanity
      if(factory_name.match(/[^\w_]+/)){
        throw "Factory name should not contain spaces or other funky characters";
      }

      if(defaults === undefined) defaults = function(){return {}};

      // The object creator
      this.factories[factory_name] = function(options){
        if(options === undefined) options = function(){return {}};
        arguments =  _.extend({}, {
          factory_id: BackboneFactory.next(factory_name_id)
        }, defaults.call(), options.call());
        return new klass(arguments);
      };

      // Lets define a sequence for id
      BackboneFactory.define_sequence(factory_name_id, function(number){
        return number;
      });
    },

    create: function(factory_name, options){
      if(this.factories[factory_name] === undefined){
        throw "Factory with name " + factory_name + " does not exist";
      }
      return this.factories[factory_name].apply(null, [options]);        
    },

    define_sequence: function(sequence_name, callback){
      this.sequences[sequence_name] = {}
      this.sequences[sequence_name]['counter'] = 0;
      this.sequences[sequence_name]['callback'] = callback; 
    },

    next: function(sequence_name){
      if(_.isUndefined(this.sequences[sequence_name])) {
        throw "Sequence with name " + sequence_name + " does not exist";
      } else {
        var args = _.toArray(arguments),
            sequence_counter = this.sequences[sequence_name].counter;

        if (_.size(args) > 1) {
          args.splice(0, 1);
        } else {
          this.sequences[sequence_name].counter = sequence_counter + 1;
          args = [this.sequences[sequence_name].counter];
        }
        return this.sequences[sequence_name]['callback'].apply(null, args); //= callback;
      }
    }
  }
})();
