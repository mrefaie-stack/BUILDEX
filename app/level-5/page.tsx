import { redirect } from 'next/navigation';
// Level 5 was the old "final battle". After the 1→4 renumber it lives at /level-4.
export default function Level5Redirect() {
  redirect('/level-4');
}
