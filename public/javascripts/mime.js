var syncer = function(user, cb) {
    if (user.dom) {
        delete user.dom
    }
    $.post('/user/sync', {
        user: user
    }, function(stat) {
        cb(stat);
    });
}

var fetch = function() {
    var ds = $('#ds-thread');
    var meta = ds.find('.ds-toolbar .ds-visitor a.ds-visitor-name');
    var avatar = ds.find('.ds-replybox .ds-avatar img');
    return {
        dom: ds,
        url: meta.attr('href'),
        name: meta.text(),
        avatar: avatar.attr('src')
    }
}

$(document).ready(function($) {
    var check = setInterval(function() {
        var ds = fetch();
        if (ds.dom.length) {
            syncer(ds, function(result) {
                if (result.stat == 'ok') {
                    alert('用户信息已更新!')
                    // window.location.reload();
                }
            });
            clearInterval(check);
        }
    }, 5000);
});