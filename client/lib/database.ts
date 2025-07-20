import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Types
export interface FirebaseProject {
  id?: string;
  name: string;
  description: string;
  client: string;
  clientId?: string;
  location: string;
  items: any[];
  totalBudget: number;
  customRates?: any;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId?: string; // For multi-user support
}

export interface FirebaseClient {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId?: string; // For multi-user support
}

// Project operations
export const projectsCollection = collection(db, "projects");
export const clientsCollection = collection(db, "clients");

export class DatabaseService {
  // Project CRUD operations
  static async createProject(
    project: Omit<FirebaseProject, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(projectsCollection, {
        ...project,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  static async getProjects(userId?: string): Promise<FirebaseProject[]> {
    try {
      let q = query(projectsCollection, orderBy("updatedAt", "desc"));

      if (userId) {
        q = query(
          projectsCollection,
          where("userId", "==", userId),
          orderBy("updatedAt", "desc"),
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseProject[];
    } catch (error) {
      console.error("Error getting projects:", error);
      return [];
    }
  }

  static async getProject(id: string): Promise<FirebaseProject | null> {
    try {
      const docRef = doc(projectsCollection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as FirebaseProject;
      }
      return null;
    } catch (error) {
      console.error("Error getting project:", error);
      return null;
    }
  }

  static async updateProject(
    id: string,
    updates: Partial<FirebaseProject>,
  ): Promise<void> {
    try {
      const docRef = doc(projectsCollection, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  static async deleteProject(id: string): Promise<void> {
    try {
      const docRef = doc(projectsCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }

  // Client CRUD operations
  static async createClient(
    client: Omit<FirebaseClient, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(clientsCollection, {
        ...client,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  }

  static async getClients(userId?: string): Promise<FirebaseClient[]> {
    try {
      let q = query(clientsCollection, orderBy("name", "asc"));

      if (userId) {
        q = query(
          clientsCollection,
          where("userId", "==", userId),
          orderBy("name", "asc"),
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseClient[];
    } catch (error) {
      console.error("Error getting clients:", error);
      return [];
    }
  }

  static async updateClient(
    id: string,
    updates: Partial<FirebaseClient>,
  ): Promise<void> {
    try {
      const docRef = doc(clientsCollection, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  }

  static async deleteClient(id: string): Promise<void> {
    try {
      const docRef = doc(clientsCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  }

  // Sync local data to Firebase
  static async syncLocalToFirebase(
    projects: any[],
    clients: any[],
  ): Promise<void> {
    try {
      // Sync projects
      for (const project of projects) {
        if (!project.firebaseId) {
          const firebaseId = await this.createProject({
            name: project.name,
            description: project.description,
            client: project.client,
            location: project.location,
            items: project.items,
            totalBudget: project.totalBudget,
            customRates: project.customRates,
          });
          // Update local project with Firebase ID
          project.firebaseId = firebaseId;
        }
      }

      // Sync clients
      for (const client of clients) {
        if (!client.firebaseId) {
          const firebaseId = await this.createClient({
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
          });
          // Update local client with Firebase ID
          client.firebaseId = firebaseId;
        }
      }
    } catch (error) {
      console.error("Error syncing to Firebase:", error);
      throw error;
    }
  }

  // Check if Firebase is available
  static async isFirebaseAvailable(): Promise<boolean> {
    try {
      // Try to perform a simple operation
      const testQuery = query(projectsCollection, orderBy("updatedAt", "desc"));
      await getDocs(testQuery);
      return true;
    } catch (error) {
      console.log("Firebase not available, using local storage");
      return false;
    }
  }
}
