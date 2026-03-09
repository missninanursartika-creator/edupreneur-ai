import {
  LayoutDashboard, Search, Users, Target, BookOpen, Heart,
  Lightbulb, Dna, Briefcase, Megaphone, PenTool, MessageCircle
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Riset Market Sekolah", url: "/riset-market", icon: Search },
  { title: "Analisis Kompetitor", url: "/analisis-kompetitor", icon: Users },
  { title: "Positioning Sekolah", url: "/positioning", icon: Target },
  { title: "Program Unggulan", url: "/program-unggulan", icon: BookOpen },
  { title: "Value Proposition Canvas", url: "/value-proposition", icon: Heart },
  { title: "Generator Nama Sekolah", url: "/generator-nama", icon: Lightbulb },
  { title: "Desain DNA Sekolah", url: "/dna-sekolah", icon: Dna },
  { title: "Model Bisnis Sekolah", url: "/model-bisnis", icon: Briefcase },
  { title: "Strategi Marketing PPDB", url: "/marketing-ppdb", icon: Megaphone },
  { title: "Konten Marketing", url: "/konten-marketing", icon: PenTool },
  { title: "AI Konsultan Sekolah", url: "/konsultan-ai", icon: MessageCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div>
            <h2 className="text-sm font-bold tracking-tight">School Strategy AI</h2>
            <p className="text-xs opacity-80 mt-0.5">Bangun Sekolah Unggul</p>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold">S</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent font-medium"
                    >
                      <item.icon className="h-4 w-4 mr-2 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
