'use client';
import { useBoardConfigurationStore } from '@/stores/boardConfiguration';
import { GoSidebarExpand as HideSidebarIcon } from "react-icons/go";
import { GoSidebarCollapse as ShowSidebarIcon } from "react-icons/go";

export function ExpandedBtn() {
  const { setShowSidebar, showSidebar } = useBoardConfigurationStore();

  return (
    <button
      onClick={() => setShowSidebar(!showSidebar)}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {showSidebar
        ? <HideSidebarIcon size={20} />
        : <ShowSidebarIcon size={20} />
      }
    </button>
  );
}
