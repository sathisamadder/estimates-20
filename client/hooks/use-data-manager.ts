import { useState, useEffect, useCallback } from "react";
import { DatabaseService } from "@/lib/database";

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  clientId?: string;
  location: string;
  numberOfFloors?: number;
  items: any[];
  totalBudget: number;
  customRates?: any;
  createdAt: string;
  updatedAt: string;
  firebaseId?: string;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  firebaseId?: string;
}

interface LocalStorageData {
  projects: Project[];
  clients: ClientData[];
  currentProjectId: string | null;
  lastSaved: string;
  lastSynced?: string;
}

export function useDataManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  // Check Firebase availability
  useEffect(() => {
    const checkFirebase = async () => {
      const available = await DatabaseService.isFirebaseAvailable();
      setIsFirebaseAvailable(available);
    };
    checkFirebase();
  }, []);

  // Save to local storage
  const saveToLocalStorage = useCallback(() => {
    try {
      const data: LocalStorageData = {
        projects,
        clients,
        currentProjectId,
        lastSaved: new Date().toISOString(),
        lastSynced,
      };
      localStorage.setItem("construction-estimator-data", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [projects, clients, currentProjectId, lastSynced]);

  // Load from local storage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem("construction-estimator-data");
      if (savedData) {
        const data: LocalStorageData = JSON.parse(savedData);
        setProjects(data.projects || []);
        setClients(data.clients || []);
        setCurrentProjectId(data.currentProjectId);
        setLastSynced(data.lastSynced || null);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, []);

  // Sync with Firebase
  const syncWithFirebase = useCallback(async () => {
    if (!isFirebaseAvailable || isSyncing) return;

    setIsSyncing(true);
    try {
      // Load data from Firebase
      const [firebaseProjects, firebaseClients] = await Promise.all([
        DatabaseService.getProjects(),
        DatabaseService.getClients(),
      ]);

      // Convert Firebase data to local format
      const convertedProjects: Project[] = firebaseProjects.map((fp) => ({
        id: fp.id || "",
        name: fp.name,
        description: fp.description,
        client: fp.client,
        clientId: fp.clientId,
        location: fp.location,
        items: fp.items,
        totalBudget: fp.totalBudget,
        customRates: fp.customRates,
        createdAt: fp.createdAt.toDate().toISOString(),
        updatedAt: fp.updatedAt.toDate().toISOString(),
        firebaseId: fp.id,
      }));

      const convertedClients: ClientData[] = firebaseClients.map((fc) => ({
        id: fc.id || "",
        name: fc.name,
        email: fc.email,
        phone: fc.phone,
        address: fc.address,
        createdAt: fc.createdAt.toDate().toISOString(),
        updatedAt: fc.updatedAt.toDate().toISOString(),
        firebaseId: fc.id,
      }));

      // Merge with local data (Firebase takes precedence for existing items)
      const mergedProjects = [...convertedProjects];
      const mergedClients = [...convertedClients];

      // Add local-only items that haven't been synced
      projects.forEach((localProject) => {
        if (
          !localProject.firebaseId &&
          !mergedProjects.find((p) => p.id === localProject.id)
        ) {
          mergedProjects.push(localProject);
        }
      });

      clients.forEach((localClient) => {
        if (
          !localClient.firebaseId &&
          !mergedClients.find((c) => c.id === localClient.id)
        ) {
          mergedClients.push(localClient);
        }
      });

      setProjects(mergedProjects);
      setClients(mergedClients);
      setLastSynced(new Date().toISOString());

      // Sync local-only data to Firebase
      await DatabaseService.syncLocalToFirebase(
        projects.filter((p) => !p.firebaseId),
        clients.filter((c) => !c.firebaseId),
      );
    } catch (error) {
      console.error("Error syncing with Firebase:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [isFirebaseAvailable, isSyncing, projects, clients]);

  // Auto-save to local storage
  useEffect(() => {
    if (projects.length > 0 || clients.length > 0) {
      saveToLocalStorage();
    }
  }, [projects, clients, currentProjectId, saveToLocalStorage]);

  // Load data on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Sync with Firebase when available
  useEffect(() => {
    if (isFirebaseAvailable) {
      syncWithFirebase();
    }
  }, [isFirebaseAvailable, syncWithFirebase]);

  // Project operations
  const createProject = useCallback(
    async (
      projectData: Omit<
        Project,
        "id" | "createdAt" | "updatedAt" | "firebaseId"
      >,
    ) => {
      const newProject: Project = {
        ...projectData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProjects((prev) => [...prev, newProject]);

      // Save to Firebase if available
      if (isFirebaseAvailable) {
        try {
          const firebaseId = await DatabaseService.createProject({
            name: newProject.name,
            description: newProject.description,
            client: newProject.client,
            clientId: newProject.clientId,
            location: newProject.location,
            items: newProject.items,
            totalBudget: newProject.totalBudget,
            customRates: newProject.customRates,
          });

          // Update local project with Firebase ID
          setProjects((prev) =>
            prev.map((p) =>
              p.id === newProject.id ? { ...p, firebaseId } : p,
            ),
          );
        } catch (error) {
          console.error("Error creating project in Firebase:", error);
        }
      }

      return newProject;
    },
    [isFirebaseAvailable],
  );

  const updateProject = useCallback(
    async (id: string, updates: Partial<Project>) => {
      const updatedProject = {
        ...updates,
        updatedAt: new Date().toISOString(),
      } as Partial<Project>;

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedProject } : p)),
      );

      // Update in Firebase if available
      const project = projects.find((p) => p.id === id);
      if (isFirebaseAvailable && project?.firebaseId) {
        try {
          // Filter out non-Firebase compatible fields
          const {
            createdAt,
            updatedAt,
            id: projectId,
            firebaseId,
            ...firebaseUpdates
          } = updatedProject;
          await DatabaseService.updateProject(
            project.firebaseId,
            firebaseUpdates as any,
          );
        } catch (error) {
          console.error("Error updating project in Firebase:", error);
        }
      }
    },
    [isFirebaseAvailable, projects],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      const project = projects.find((p) => p.id === id);

      setProjects((prev) => prev.filter((p) => p.id !== id));

      // Delete from Firebase if available
      if (isFirebaseAvailable && project?.firebaseId) {
        try {
          await DatabaseService.deleteProject(project.firebaseId);
        } catch (error) {
          console.error("Error deleting project from Firebase:", error);
        }
      }
    },
    [isFirebaseAvailable, projects],
  );

  // Client operations
  const createClient = useCallback(
    async (
      clientData: Omit<
        ClientData,
        "id" | "createdAt" | "updatedAt" | "firebaseId"
      >,
    ) => {
      const newClient: ClientData = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setClients((prev) => [...prev, newClient]);

      // Save to Firebase if available
      if (isFirebaseAvailable) {
        try {
          const firebaseId = await DatabaseService.createClient({
            name: newClient.name,
            email: newClient.email,
            phone: newClient.phone,
            address: newClient.address,
          });

          // Update local client with Firebase ID
          setClients((prev) =>
            prev.map((c) => (c.id === newClient.id ? { ...c, firebaseId } : c)),
          );
        } catch (error) {
          console.error("Error creating client in Firebase:", error);
        }
      }

      return newClient;
    },
    [isFirebaseAvailable],
  );

  const updateClient = useCallback(
    async (id: string, updates: Partial<ClientData>) => {
      const updatedClient = {
        ...updates,
        updatedAt: new Date().toISOString(),
      } as Partial<ClientData>;

      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatedClient } : c)),
      );

      // Update in Firebase if available
      const client = clients.find((c) => c.id === id);
      if (isFirebaseAvailable && client?.firebaseId) {
        try {
          // Filter out non-Firebase compatible fields
          const {
            createdAt,
            updatedAt,
            id: clientId,
            firebaseId,
            ...firebaseUpdates
          } = updatedClient;
          await DatabaseService.updateClient(
            client.firebaseId,
            firebaseUpdates as any,
          );
        } catch (error) {
          console.error("Error updating client in Firebase:", error);
        }
      }
    },
    [isFirebaseAvailable, clients],
  );

  const deleteClient = useCallback(
    async (id: string) => {
      const client = clients.find((c) => c.id === id);

      setClients((prev) => prev.filter((c) => c.id !== id));

      // Delete from Firebase if available
      if (isFirebaseAvailable && client?.firebaseId) {
        try {
          await DatabaseService.deleteClient(client.firebaseId);
        } catch (error) {
          console.error("Error deleting client from Firebase:", error);
        }
      }
    },
    [isFirebaseAvailable, clients],
  );

  return {
    // Data
    projects,
    clients,
    currentProjectId,

    // State
    isFirebaseAvailable,
    isSyncing,
    lastSynced,

    // Actions
    setCurrentProjectId,
    createProject,
    updateProject,
    deleteProject,
    createClient,
    updateClient,
    deleteClient,
    syncWithFirebase,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
}
