import "./App.css";
import {
  ProSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { useState } from "react";
import MIMUST from "./comps/MIMUST";
import Anchorst from "./comps/Anchorst";

function App() {
  const [selectedPage, seSelectedPage] = useState(0);

  return (
    <div className="App">
      <div className="navbar">
        <ProSidebar>
          <SidebarHeader>Notifications:</SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <MenuItem onClick={() => seSelectedPage(1)}>Settings</MenuItem>
              <MenuItem onClick={() => seSelectedPage(2)}>Nothing</MenuItem>
            </Menu>
          </SidebarContent>
          <SidebarFooter>Footer</SidebarFooter>
        </ProSidebar>
      </div>
      <div className="page">
        {selectedPage === 0 && <div>home</div>}
        {selectedPage === 1 && (
          <div>
            <MIMUST />
          </div>
        )}
        {selectedPage === 2 && (
          <div>
            <Anchorst />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
