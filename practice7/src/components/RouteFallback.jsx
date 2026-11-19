
import useOnlineStatus from "../hooks/useOnlineStatus.js";
import OfflinePage from "../pages/OfflinePage";
import NotFound from "../pages/NotFound";

export default function RouteFallback() {
    const isOnline = useOnlineStatus();
    console.log("RouteFallback VERSION 2:", isOnline);
    return isOnline ? <NotFound /> : <OfflinePage />;

}
