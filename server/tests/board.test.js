import assert from 'assert'
import { Factory } from 'meteor/dburles:factory';

describe('lists.public', function () {
    it('sends all public lists', function (done) {
        // Set a user id that will be provided to the publish function as `this.userId`,
        // in case you want to tests authentication.
        const collector = new PublicationCollector({userId: 'some-id'});

        // Collect the data published from the `lists.public` publication.
        collector.collect('lists.public', (collections) => {
            // `collections` is a dictionary with collection names as keys,
            // and their published documents as values in an array.
            // Here, documents from the collection 'Lists' are published.
            chai.assert.typeOf(collections.Lists, 'array');
            chai.assert.equal(collections.Lists.length, 3);
            done();
        });
    });
});
