export enum Constant {
  LIMIT = 10,
  PAGE = 1,
  SORT_COLUMN = 'createdAt',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum QUEUES {
  MSG_QUEUE = 'TINKTALK_QUEUE.MSG',
  NOTIFICATION_QUEUE = 'TINKTALK_QUEUE.NOTIFACATION',
}

export enum NotificationJobType {
  GROUP_CREATED = 'group-created',
  ADDED_TO_GROUP = 'added-to-group',
  REMOVED_FROM_GROUP = 'removed-from-group',
  GROUP_UPDATED = 'group-updated',
  NEW_ADMIN = 'new-admin',
}

export enum NotificationJobName {
  GROUP_CREATED = 'group-created',
}
