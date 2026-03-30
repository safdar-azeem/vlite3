# StatusChip

**Import:** `import { StatusChip } from 'vlite3'`

A smart wrapper around `Chip` that automatically resolves a status string to the correct color variant and icon. Handles normalization of casing and delimiters — `in_progress`, `InProgress`, `IN-PROGRESS`, and `In Progress` all map to the same chip.

### Props

| Prop        | Type                             | Default   | Description                                               |
| :---------- | :------------------------------- | :-------- | :-------------------------------------------------------- |
| `status`    | `string`                         | **required** | Status value to resolve (e.g. `'active'`, `'in_progress'`) |
| `label`     | `string`                         | —         | Override the resolved display label                       |
| `labelI18n` | `string`                         | —         | i18n translation key for the label (takes priority over `label`) |
| `hideIcon`  | `boolean`                        | `false`   | Hide the auto-resolved icon even when one is mapped       |
| `size`      | `'small' \| 'medium' \| 'large'` | `small`   | Size passed through to the underlying `Chip`              |
| `class`     | `string`                         | `''`      | Additional CSS classes applied to the root                |

### Status Normalization

The `status` value is normalized before lookup: lowercased, and all `-`, `_`, and spaces are stripped. This means the following all resolve identically:
```
'in_progress'  →  'inprogress'
'InProgress'   →  'inprogress'
'IN-PROGRESS'  →  'inprogress'
'In Progress'  →  'inprogress'
```

### Resolved Status Groups

**Payments & ERP / Finance**

| Status value       | Variant   |
| :----------------- | :-------- |
| `paid`             | `success` |
| `unpaid`           | `danger`  |
| `pending`          | `warning` |
| `partially_paid`   | `cyan`    |
| `refunded`         | `pink`    |
| `overdue`          | `orange`  |
| `void` / `voided`  | `secondary`|
| `cancelled`        | `pink`    |
| `invoiced`         | `indigo`  |
| `billed`           | `indigo`  |
| `unbilled`         | `warning` |
| `quoted`           | `cyan`    |
| `cleared`          | `success` |
| `reconciled`       | `success` |
| `unreconciled`     | `warning` |
| `posted`           | `success` |
| `unposted`         | `secondary`|
| `settled`          | `success` |
| `authorized`       | `success` |
| `unauthorized`     | `danger`  |

**Orders & Fulfillment**

| Status value    | Variant   |
| :-------------- | :-------- |
| `confirmed`     | `success` |
| `processing`    | `info`    |
| `in_progress`   | `info`    |
| `dispatched`    | `cyan`    |
| `in_transit`    | `purple`  |
| `shipped`       | `teal`    |
| `delivered`     | `teal`    |
| `completed`     | `success` |
| `rejected`      | `danger`  |

**HR & Recruiting**

| Status value   | Variant    |
| :------------- | :--------- |
| `present`      | `success`  |
| `absent`       | `danger`   |
| `active`       | `success`  |
| `inactive`     | `secondary`|
| `on_hold`      | `orange`   |
| `terminated`   | `danger`   |
| `suspended`    | `pink`     |
| `hired`        | `success`  |
| `interviewing` | `indigo`   |
| `shortlisted`  | `teal`     |
| `offered`      | `purple`   |
| `onboarding`   | `info`     |
| `probation`    | `warning`  |
| `promoted`     | `success`  |
| `relocated`    | `cyan`     |

**Inventory & Stock**

| Status value    | Variant   |
| :-------------- | :-------- |
| `in_stock`      | `success` |
| `low_stock`     | `warning` |
| `out_of_stock`  | `danger`  |
| `available`     | `success` |
| `fulfilled`     | `success` |
| `archived`      | `secondary`|

**Tasks & Approvals**

| Status value         | Variant   |
| :------------------- | :-------- |
| `todo`               | `secondary`|
| `in_review`          | `info`    |
| `approved`           | `success` |
| `done`               | `success` |
| `awaiting_approval`  | `warning` |
| `partially_approved` | `warning` |

**Priority & Severity**

| Status value         | Variant   |
| :------------------- | :-------- |
| `critical`           | `danger`  |
| `high`               | `danger`  |
| `urgent`             | `danger`  |
| `medium`             | `warning` |
| `normal`             | `secondary`|
| `minor`              | `secondary`|
| `trivial`            | `secondary`|
| `low`                | `orange` / `secondary` | 

**Boolean & Logic**

| Status value | Variant   |
| :----------- | :-------- |
| `yes`        | `success` |
| `no`         | `danger`  |
| `true`       | `success` |
| `false`      | `danger`  |

> Unknown statuses fall back to the `secondary` variant with the status string formatted as a readable label (e.g. `some_custom_status` → `Some Custom Status`).

### Usage
```vue
<!-- Auto-resolved -->
<StatusChip status="active" />
<StatusChip status="in_progress" />
<StatusChip status="cancelled" />

<!-- Custom label override -->
<StatusChip status="active" label="Live" />
<StatusChip status="pending" label="Awaiting Review" />

<!-- i18n label -->
<StatusChip status="active" label-i18n="statuses.active" />

<!-- Hide icon -->
<StatusChip status="completed" :hide-icon="true" />

<!-- Sizes -->
<StatusChip status="active" size="small" />
<StatusChip status="pending" size="medium" />
<StatusChip status="cancelled" size="large" />

<!-- Normalization — all render identically -->
<StatusChip status="in_progress" />
<StatusChip status="InProgress" />
<StatusChip status="IN-PROGRESS" />
<StatusChip status="In Progress" />
```

