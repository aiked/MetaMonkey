var triggerEvents = function (event, args) {
    var ev, i = -1;
    switch (args.length) {
    case 0:
        event.callback.call(ev.ctx);
        return;
    case 1:
        event.callback.call(ev.ctx, args[0]);
        return;
    case 2:
        event.callback.call(ev.ctx, args[0], args[1]);
        return;
    case 3:
        event.callback.call(ev.ctx, args[0], args[1], args[2]);
        return;
    case 4:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3]);
        return;
    case 5:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4]);
        return;
    case 6:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4], args[5]);
        return;
    case 7:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        return;
    case 8:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        return;
    case 9:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
        return;
    case 10:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
        return;
    default:
        event.callback.apply(ev.ctx, args);
        return;
    }
}
;
