import type { NavigateFunction } from "react-router-dom";

export class navigateUtils {
    public static goBackWithClose(
        window: Window,
        navigate: NavigateFunction
    ) {
        const canNavBack = navigateUtils.canGoBack(window);
        const canCloseWin = navigateUtils.canClose(window);

        if (canNavBack)
            navigate(-1);
        else if (canCloseWin)
            window.close();
    }

    public static canGoBackWithClose(window: Window): boolean {
        return (
            navigateUtils.canGoBack(window) ||
            navigateUtils.canClose(window)
        );
    }

    public static canGoBack(window: Window): boolean {
        return window.history.length > 2;
    }

    public static canClose(window: Window): boolean {
        return (
            window.opener // From MDN: Windows opened because of links with a target of _blank don't get an opener, unless explicitly requested with rel=opener. Windows opened because of links with a target of _new do get an opener.
            ||
            window.parent !== window // From MDN: If a window does not have a parent, its parent property is a reference to itself.
        );
    }
}