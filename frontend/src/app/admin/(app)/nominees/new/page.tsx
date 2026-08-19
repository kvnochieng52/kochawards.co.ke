import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { NomineeForm } from '@/components/admin/NomineeForm';

export default function NewNomineePage() {
  return (
    <>
      <AdminTopBar
        title="Add a nominee"
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Nominees', href: '/admin/nominees' },
          { label: 'New' },
        ]}
      />
      <div className="mx-auto max-w-5xl p-4 md:p-6">
        <NomineeForm mode="create" />
      </div>
    </>
  );
}
