const GroupMemberState = {
    OWNER: { id: 0, description: "This is the group owner"},
    APPROVED: { id: 1, description: "This member has been approved" },
    WAITING: { id: 2, description: "When a user applies a group, the initial state is WAITING"},
    INVITED: { id: 3, description: "When group owner invites a user, the user will be INVITED"},
    BANNED: { id: 4, description: "A group owner is able to ban someone, the banned user cannot apply for this group"},
  };
  
  module.exports = GroupMemberState;
  