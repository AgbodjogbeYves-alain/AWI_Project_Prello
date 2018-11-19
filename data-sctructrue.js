User: {
    _id: MongoId
    profile: {
        lastname: String
        firstname: String
        email: String
        enabledMails: Boolean
        google_id: String
        trelloToken: String
    }
    username: String
    emails: {
        address: String
        verified: String
    }
}

Team: {
    _id: MongoId
    teamName: String
    teamDescription: String
    teamOwner : MongoId
    teamMembers: Array 
    teamMembers$: {
        userId: MongoId
        role: String
    }
}

Board: {
    _id; MongoId
    boardTitle: String
    boardDescription: String
    boardBackground: String
    boardUsers: Array
    boardUsers$: {
        userId: MongoId
        role: String
    }
    boardPrivacy: Boolean
    boardLists: Array
    boardLists$: {
        _id: MongoId
        listTitle: String
        listCards: Array
        listCards$: {
            _id: String
            cardTitle: String
            cardDescription: String
            cardDeadline: String
            cardLabels: Array
            cardLabels$: MongoId
            cardComments: Array
            cardComments$: {
                _id: MongoId
                commentContent: String
                userId: MongoId
                commentCreatedAt: Date
            }
            isArchived: Boolean
            cardUsers: Array
            cardUsers$ : MongoId
            cardChecklists: Array
            cardChecklists$: MongoId
            cardCreatedAt: Date
        }
        listCreatedAt: Date
        listArchived: Boolean
    }
    boardTeams: Array
    boardTeams$: MongoId
    boardOwner : MongoId
    boardCreatedAt: Date
}

Checklist: {
    _id: MongoId
    checklistName: String
    checklistItems: Array
    checklistItems$: {
        _id: MongoId
        itemName: String
        itemChecked: Boolean
    }
    boardId: MongoId
    cardCreatedAt: Date
}

Label: {
    _id: MongoId
    labelName: String
    labelColor: String
    labelBoard: MongoId
}

Comment: {
    _id: MongoId
    commentContent: String
    userId: MongoId
    commentCreatedAt: Date
}