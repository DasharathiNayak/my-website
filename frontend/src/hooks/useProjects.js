import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as dashboardService from "../services/dashboardService";

export default function useProjects() {

    const [projects, setProjects] = useState([]);

    // ============================================================
    // LOAD PROJECTS
    // ============================================================

    const loadProjects = async () => {

        try {

            const userId = localStorage.getItem("user_id");

            console.log("Loading Projects for user:", userId);

            if (!userId) {
                console.error("User ID not found in localStorage");
                setProjects([]);
                return;
            }

            const response =
                await dashboardService.getProjects(userId);

            console.log(
                "Projects API Response:",
                response
            );

            setProjects(
                response.data || []
            );

        } catch (err) {

            console.error(
                "Load Projects Error:",
                err
            );

            console.error(
                "Load Projects Response:",
                err.response?.data
            );

            toast.error(
                err.response?.data?.detail ||
                "Failed to load projects"
            );
        }
    };


    // ============================================================
    // CREATE PROJECT
    // ============================================================

    const createProject = async (projectData) => {

        try {

            const userId =
                localStorage.getItem("user_id");

            if (!userId) {

                toast.error(
                    "User ID not found. Please login again."
                );

                return false;
            }

            const payload = {

                user_id: Number(userId),

                project_name:
                    projectData.project_name.trim(),

                description:
                    projectData.description?.trim() || "",

                application_type:
                    projectData.application_type,

                status:
                    projectData.status || "Active"
            };


            console.log(
                "Creating Project Payload:",
                payload
            );


            // API CALL
            const response =
                await dashboardService.createProject(
                    payload
                );


            console.log(
                "CREATE PROJECT API RESPONSE:",
                response
            );

            console.log(
                "CREATE PROJECT RESPONSE DATA:",
                response.data
            );


            // Success
            if (
                response.status >= 200 &&
                response.status < 300
            ) {

                toast.success(
                    response.data?.message ||
                    "Project created successfully"
                );


                // Refresh project list
                await loadProjects();


                console.log(
                    "Project created and project list refreshed"
                );


                return true;
            }


            return false;

        } catch (err) {

            console.error(
                "CREATE PROJECT ERROR:",
                err
            );

            console.error(
                "CREATE PROJECT ERROR RESPONSE:",
                err.response
            );

            console.error(
                "CREATE PROJECT ERROR DATA:",
                err.response?.data
            );

            console.error(
                "CREATE PROJECT ERROR STATUS:",
                err.response?.status
            );


            toast.error(
                err.response?.data?.detail ||
                err.message ||
                "Project creation failed"
            );


            return false;
        }
    };

    const updateProject = async (projectId, projectData) => {
        try {
            const response = await dashboardService.updateProject(
                projectId,
                projectData
            );

            if (response.status >= 200 && response.status < 300) {
                toast.success(
                    response.data?.message ||
                    "Project updated successfully"
                );

                await loadProjects();
                return true;
            }

            return false;
        } catch (err) {
            console.error("UPDATE PROJECT ERROR:", err);

            toast.error(
                err.response?.data?.detail ||
                err.message ||
                "Project update failed"
            );

            return false;
        }
    };

    const deleteProject = async (projectId) => {
        try {
            const response = await dashboardService.deleteProject(projectId);

            if (response.status >= 200 && response.status < 300) {
                toast.success(
                    response.data?.message ||
                    "Project deleted successfully"
                );

                await loadProjects();
                return true;
            }

            return false;
        } catch (err) {
            console.error("DELETE PROJECT ERROR:", err);

            toast.error(
                err.response?.data?.detail ||
                err.message ||
                "Project deletion failed"
            );

            return false;
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        loadProjects();

    }, []);


    return {
        projects,
        loadProjects,
        createProject,
        updateProject,
        deleteProject
    };
}