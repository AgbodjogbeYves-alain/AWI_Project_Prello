import assert from "assert";
import {Meteor} from "meteor/meteor";
import {Boards} from "../models/Boards";
import '../api/users.js';
import '../api/boards';
import '../api/lists';
import '../api/cards'
import '../api/teams';
import '../api/labels';
import '../api/checklists';

describe("server", function () {
    it("package.json has correct name", async function () {
        const { name } = await import("../package.json");
        assert.strictEqual(name, "server");
    });

    if (Meteor.isServer) {
        it("server is not client", function () {
            assert.strictEqual(Meteor.isClient, false);
        });
    }
});


/* ------------------------- TESTS ON BOARD -----------------------*/

describe("board", function() {
    it('should add new id', function() {
        let board = {
            boardTitle: "New Board",
            boardDescription: "Board for test",
            boardUsers: [],
            boardTeams: [],
            boardBackground: "",
            boardPrivacy: 1
        };
        const boardId = Meteor.call('boards.createBoard',board)
        assert.isString(boardId)
    });

    it('should exist', function() {
        let board = {
            boardTitle: "New Board",
            boardDescription: "Board for test",
            boardUsers: [],
            boardTeams: [],
            boardBackground: "",
            boardPrivacy: 1
        };
        const boardId = Meteor.call('boards.createBoard',board)
        const newBoard = Meteor.call('boards.getBoard',boardId)
        assert.deepEqual(board,newBoard)
    });


    it('should modify the board', function() {
        let board = {
            boardTitle: "Previous board",
            boardDescription: "Board for test",
            boardUsers: [],
            boardTeams: [],
            boardBackground: "",
            boardPrivacy: 1
        };


        const boardId = Meteor.call('boards.createBoard',board)
        let newBoard = {
            _id: boardId,
            boardTitle: "Hello",
            boardDescription: "Board for test",
            boardUsers: [],
            boardTeams: [],
            boardBackground: "",
            boardPrivacy: 1
        };

        Meteor.call('board.editBoard',newBoard, function() {
            const board = Meteor.call('boards.getBoard',boardId)
            assert.deepEqual(board, newBoard)
        })
    });

    it('should modify the board', function() {
        let board = {
            boardTitle: "Previous board",
            boardDescription: "Board for test",
            boardUsers: [],
            boardTeams: [],
            boardBackground: "",
            boardPrivacy: 1
        };


        const boardId = Meteor.call('boards.createBoard',board)
        let newBoard = {
            _id: boardId,
            boardTitle: "Hello",
            boardDescription: "Board for test",
            boardUsers: [],
            boardTeams: [],
            boardBackground: "",
            boardPrivacy: 1
        };

        Meteor.call('board.editBoard',newBoard, function() {
            const board = Meteor.call('boards.getBoard',boardId)
            assert.deepEqual(board, newBoard)
        })
    });


    it('should remove the board', function() {
        let board = {
            boardTitle: "Previous board",
            boardDescription: "Board for test",
            boardUsers: [],
            boardTeams: [],
            boardBackground: "",
            boardPrivacy: 1
        };


        const boardId = Meteor.call('boards.createBoard',board)

        Meteor.call('board.removeBoard',boardId, function() {
            const board = Meteor.call('boards.getBoard',boardId)
            assert.typeOf(board, Meteor.Error)
        })
    });

    it('should return board labels', function() {
        let board = {
            boardTitle: "Previous board",
            boardDescription: "Board for test",
            boardUsers: [],
            boardTeams: [],
            boardLabels: ['idLable1','idLabel2'],
            boardBackground: "",
            boardPrivacy: 1
        };


        const boardId = Meteor.call('boards.createBoard',board)

        Meteor.call('board.getTags',boardId, function(error,response) {
            assert.deepEqual(response, ['idLable1','idLabel2'])
        })
    });

    it('should return board list', function() {
        let list1 = {_id: "list1", listTitle: "New list", listCards: [], listArchived: false}
        let list2 = {_id: "list1", listTitle: "New list", listCards: [], listArchived: false}

        let board = {
            boardTitle: "Previous board",
            boardDescription: "Board for test",
            boardUsers: [],
            boardTeams: [],
            boardLists : [list1,list2],
            boardBackground: "",
            boardPrivacy: 1
        };


        const boardId = Meteor.call('boards.createBoard',board)

        Meteor.call('board.getLists',boardId, function(error, response) {
            assert.deepEqual(response, [list1,list2])
        })
    });

    it('should return board team', function() {
        let board = {
            boardTitle: "Previous board",
            boardDescription: "Board for test",
            boardUsers: [],
            boardTeams: ["idteam1","idteam2"],
            boardBackground: "",
            boardPrivacy: 1
        };


        const boardId = Meteor.call('boards.createBoard',board)

        Meteor.call('board.getTeam',boardId, function(error,result) {
            assert.deepEqual(result, ["idteam1","idteam2"])
        })
    });
})


/* ------------------------- TESTS ON LIST -----------------------*/

describe("lists", function() {
    it('should create a new list', function() {
        let list1 = {_id: "list1", listTitle: "list", listCards: [], listArchived: false}

        let board = {
            boardTitle: "Previous board",
            boardDescription: "Board for test",
            boardUsers: [list1],
            boardTeams: ["idteam1","idteam2"],
            boardBackground: "",
            boardPrivacy: 1
        };


        const boardId = Meteor.call('boards.createBoard',board)



        Meteor.call('board.lists.createList',boardId, function() {
            const newBoard = Meteor.call('boards.getBoard',boardId);

            assert.strictEqual(newBoard.boardLists.length, 0);
            assert.strictEqual(newBoard.boardLists[1],"New list")
        })
    });
    it('should remove list', function() {
        let list1 = {_id: "list1", listTitle: "list", listCards: [], listArchived: false}

        let board = {
            boardTitle: "Previous board",
            boardDescription: "Board for test",
            boardUsers: [list1],
            boardTeams: ["idteam1","idteam2"],
            boardBackground: "",
            boardPrivacy: 1
        };


        const boardId = Meteor.call('boards.createBoard',board)



        Meteor.call('board.getBoard',boardId, function(error,response) {
            let list = response.boardLists[1]

            Meteor.call('boards.list.removeList',boardId,list._id, function(){
                let board = Meteor.call('board.getBoard',boardId)
                assert.strictEqual(board.boardLists.length, 0);
            })
        })
    });

    it('should edit list', function() {
        let list1 = {_id: "list1", listTitle: "list", listCards: [], listArchived: false}

        let board = {
            boardTitle: "Previous board",
            boardDescription: "Board for test",
            boardUsers: [list1],
            boardTeams: ["idteam1","idteam2"],
            boardBackground: "",
            boardPrivacy: 1
        };


        const boardId = Meteor.call('boards.createBoard',board)


        Meteor.call('board.getBoard',boardId, function(error,response) {
           let list = response.boardLists[1]
           list.listTitle =  "New Title for the list"

            Meteor.call('boards.list.editList',boardId,list, function(error,response){
                let board = Meteor.call('board.getBoard',boardId)
                assert.strictEqual(board.boardLists[0].listTitle, "New Title for the list");
            })
        })
    });
})

/* ------------------------- TESTS ON CARD -----------------------*/
