import {
    addDoc,
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    type Firestore,
    type Timestamp,
} from 'firebase/firestore';
import { validateContent, type ContentRecord } from '@/lib/content';

export type ContentEdit = Omit<ContentRecord, 'id' | 'createdBy' | 'updatedBy'> & {
    id?: string;
    updatedAt?: Timestamp | null;
};

export class ContentConflict extends Error {}

export async function saveOfficerContent(db: Firestore, uid: string, edit: ContentEdit) {
    const invalid = validateContent(edit);
    if (invalid) throw new Error(invalid);

    const { kind, title, description, category, date, location, url, image, status } = edit;
    const fields = {
        kind,
        title: title.trim(),
        description: description.trim(),
        category,
        date: date ? new Date(date).toISOString() : '',
        location: location.trim(),
        url,
        image,
        status,
        updatedBy: uid,
        updatedAt: serverTimestamp(),
    };

    if (!edit.id) {
        return (
            await addDoc(collection(db, 'content'), {
                ...fields,
                createdBy: uid,
                createdAt: serverTimestamp(),
            })
        ).id;
    }

    const ref = doc(db, 'content', edit.id);
    await runTransaction(db, async (transaction) => {
        const current = await transaction.get(ref);
        const revision = current.get('updatedAt') as Timestamp | undefined;
        if (
            !current.exists() ||
            (edit.updatedAt ? !revision?.isEqual(edit.updatedAt) : revision !== undefined)
        ) {
            throw new ContentConflict('This item changed while you were editing it.');
        }
        transaction.update(ref, fields);
    });
    return ref.id;
}
