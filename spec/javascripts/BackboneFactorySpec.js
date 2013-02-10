describe("Backbone Factory", function () {

  describe("Defining and using Sequences", function () {

    beforeEach(function() {
      var emailSequence = BackboneFactory.define_sequence('email', function (name) {
        return name + "@example.com";
      });
    });

    it("should return the sequence on successive calls", function () {
      expect(BackboneFactory.next('email', 'dude')).toBe('dude@example.com');
      expect(BackboneFactory.next('email', 'dudette')).toBe('dudette@example.com');
    });
 
  });

  describe("Defining and using Factories", function () {

    beforeEach(function () {

      var emailSequence = BackboneFactory.define_sequence('person_email', function (name) {
        return name + "@example.com";
      }),
      postFactory = BackboneFactory.define('post', window.Models.Post, function () {
        return {
          author: BackboneFactory.create('user')
        };
      }),
      userFactory = BackboneFactory.define('user', window.Models.User, function () {
        return {
          name : 'Backbone User',
          email: BackboneFactory.next('person_email')
        };
      });

      this.postObject = BackboneFactory.create('post');
      this.userObject = BackboneFactory.create('user');
    });
    

    it("return an instance of the Backbone Object requested", function () {
      expect(this.postObject instanceof window.Models.Post).toBeTruthy();
      expect(this.userObject instanceof window.Models.User).toBeTruthy();
    });
          
    // Not sure if this test is needed. But what the hell!
    it("should preserve the defaults if not overriden", function () {
      expect(this.postObject.get('title')).toBe('Default Title');
    });

    it("should use the defaults supplied when creating objects", function () {
      expect(this.userObject.get('name')).toBe('Backbone User');
    });

    it("should work with sequences", function(){
      var anotherUser,
          personSequence = BackboneFactory.define_sequence('person', function (firstName, lastName) {
            return firstName + ' ' + lastName;
          }),
          person;

      expect(this.userObject.get('email')).toBe('2@example.com');

      anotherUser = BackboneFactory.create('user');
      expect(anotherUser.get('email')).toBe('3@example.com');

      person = BackboneFactory.next('person', 'Dudette', 'Dudetts');
      expect(person).toBe('Dudette Dudetts');      
    });

    it("should work if other factories are passed", function () {
      expect(this.postObject.get('author') instanceof window.Models.User).toBeTruthy(); 
    })

    it("should override defaults if arguments are passed on creation", function () {
      var userWithEmail = BackboneFactory.create('user', function () {
        return {
          email: 'overriden@example.com'
        };
      });

      expect(userWithEmail.get('email')).toBe('overriden@example.com');
    });

    it("should have an id", function () {
      console.log(this.userObject)
      expect(this.userObject.id).toBeDefined();
    });

    it("should have an id that increments on creation", function () {
      var firstID = BackboneFactory.create('user').id,
          secondID = BackboneFactory.create('user').id;

      expect(secondID).toBe(firstID + 1);
    });

    describe("Error Messages", function () {

      it("should throw an error if factory_name is not proper", function () {
        expect(function () {
          BackboneFactory.define('wrong name', window.Models.Post);
        }).toThrow("Factory name should not contain spaces or other funky characters");
      });

      it("should throw an error if you try to use an undefined factory", function () {
        expect(function () {
          BackboneFactory.create('undefined_factory');
        }).toThrow("Factory with name undefined_factory does not exist");
      });

      it("should throw an error if you try to use an undefined sequence", function () {
        expect(function () {
          BackboneFactory.next('undefined_sequence');
        }).toThrow("Sequence with name undefined_sequence does not exist");
      });
      
    });
    
  });
  
});
