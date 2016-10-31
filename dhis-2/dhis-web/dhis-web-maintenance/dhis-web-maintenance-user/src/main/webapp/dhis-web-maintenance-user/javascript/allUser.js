var setAllUserPermission = function (currentUserAccount){
  $.ajax({
    type: 'GET',
    url: '../api/24/userRoles.json',
    dataType: 'json',
    username: 'admin',
    password: 'district',
    success: function(data)
    {
      $.each(data.userRoles, function(){
        if ((this.displayName == 'Superuser')
            && (this.id == currentUserAccount.id))
        {
          $('#allUserAddNew').show();
        }
        else
        {
          $('#allUserAddNew').hide();
        }
      });
    }
  });
}

jQuery(document).ready(function() {
  tableSorter('userList');

  dhis2.contextmenu.makeContextMenu({
    menuId: 'contextMenu',
    menuItemActiveClass: 'contextMenuItemActive',
    listItemProps: ['id', 'uid', 'name', 'type', 'username']
  });

  var currentAccount;
  $.ajax({
    type: 'GET',
    url: '../api/24/me.json',
    data: {fields: 'userCredentials'},
    dataType: 'json',
    success: function(data) {
      setAllUserPermission(data.userCredentials.userRoles[0]);
    }
  });



});
