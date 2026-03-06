import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Profile {
    linkedin: string;
    about: string;
    instagram: string;
    photoURL: string;
    phone: string;
}
export interface ProjectInput {
    title: string;
    link: string;
    description: string;
}
export interface Project {
    id: bigint;
    title: string;
    link: string;
    description: string;
}
export interface Visitor {
    username: string;
    date: string;
}
export interface Resume {
    data: ExternalBlob;
    name: string;
}
export interface backendInterface {
    addProject(project: ProjectInput): Promise<void>;
    getProfile(): Promise<Profile | null>;
    getProjects(): Promise<Array<Project>>;
    getResume(): Promise<Resume | null>;
    getVisitors(): Promise<Array<Visitor>>;
    recordVisitor(username: string, date: string): Promise<void>;
    removeProject(id: bigint): Promise<boolean>;
    saveProfile(photoURL: string, about: string, instagram: string, linkedin: string, phone: string): Promise<void>;
    saveResume(name: string, data: ExternalBlob): Promise<void>;
}
