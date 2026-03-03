import "server-only";
import pool from "@/lib/db";
import { FALLBACK_PERMISSIONS } from "./rolePermissions";

export async function getRolePermissionsServer() {
  try {
    const [rows] = await pool.query(
      "SELECT role_name, route_path FROM role_permissions ORDER BY role_name, route_path"
    );
    const permissions = {};
    rows.forEach(row => {
      if (!permissions[row.role_name]) {
        permissions[row.role_name] = [];
      }
      permissions[row.role_name].push(row.route_path);
    });
    if (Object.keys(permissions).length === 0) {
      return FALLBACK_PERMISSIONS;
    }
    return permissions;
  } catch (err) {
    console.error("Error loading permissions:", err);
    return FALLBACK_PERMISSIONS;
  }
}

export async function checkPermission(userRole, pathname) {
  const permissions = await getRolePermissionsServer();
  const allowedRoutes = permissions[userRole] || [];
  if (allowedRoutes.includes("*")) return true;
  return allowedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));
}