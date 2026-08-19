import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { CampaignForm } from '@/components/admin/CampaignForm';

export default function NewCampaignPage() {
  return (
    <>
      <AdminTopBar
        title="Create a campaign"
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Campaigns', href: '/admin/campaigns' },
          { label: 'New' },
        ]}
      />
      <div className="mx-auto max-w-5xl p-4 md:p-6">
        <CampaignForm mode="create" />
      </div>
    </>
  );
}
