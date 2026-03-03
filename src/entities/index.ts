/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: announcements
 * Interface for Announcements
 */
export interface Announcements {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType date */
  announcementDate?: Date | string;
  /** @wixFieldType text */
  content?: string;
  /** @wixFieldType text */
  stream?: string;
  /** @wixFieldType boolean */
  isUrgent?: boolean;
  /** @wixFieldType url */
  externalLink?: string;
}


/**
 * Collection ID: paymenttransactions
 * Interface for PaymentTransactions
 */
export interface PaymentTransactions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  studentReference?: string;
  /** @wixFieldType text */
  planPurchased?: string;
  /** @wixFieldType datetime */
  transactionDate?: Date | string;
  /** @wixFieldType number */
  amount?: number;
  /** @wixFieldType text */
  paymentMethod?: string;
  /** @wixFieldType text */
  paymentStatus?: string;
}


/**
 * Collection ID: scholarshipupdates
 * Interface for ScholarshipUpdates
 */
export interface ScholarshipUpdates {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  scholarshipName?: string;
  /** @wixFieldType text */
  scholarshipProvider?: string;
  /** @wixFieldType text */
  eligibilityCriteria?: string;
  /** @wixFieldType date */
  applicationDeadline?: Date | string;
  /** @wixFieldType url */
  applicationLink?: string;
}


/**
 * Collection ID: studentprofiles
 * Interface for StudentProfiles
 */
export interface StudentProfiles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  studentName?: string;
  /** @wixFieldType text */
  collegeEmail?: string;
  /** @wixFieldType text */
  stream?: string;
  /** @wixFieldType text */
  mobileNumber?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  passportPhoto?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  signatureImage?: string;
  /** @wixFieldType boolean */
  digitalIdStatus?: boolean;
}


/**
 * Collection ID: studymaterials
 * Interface for StudyMaterials
 */
export interface StudyMaterials {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  streamDepartment?: string;
  /** @wixFieldType text */
  materialType?: string;
  /** @wixFieldType text */
  accessLevel?: string;
  /** @wixFieldType url */
  fileUrl?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  thumbnailImage?: string;
}


/**
 * Collection ID: subscriptionplans
 * @catalog This collection is an eCommerce catalog
 * Interface for SubscriptionPlans
 */
export interface SubscriptionPlans {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  itemName?: string;
  /** @wixFieldType number */
  itemPrice?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  itemImage?: string;
  /** @wixFieldType text */
  itemDescription?: string;
  /** @wixFieldType text */
  accessLevel?: string;
}
