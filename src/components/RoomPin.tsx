import React from 'react';
import { Room, getRoomTypeDetails } from '@/types';
import clsx from 'clsx';
import titleCase from '@/util/titleCase';
import styles from '../styles/RoomPin.module.css';

const icons: { [type: string]: string } = {
  elevator: 'M11,1H4A1,1,0,0,0,3,2V13a1,1,0,0,0,1,1h7a1,1,0,0,0,1-1V2A1,1,0,0,0,11,1ZM7.5,12.5l-2-4h4Zm-2-6,2-4,2,4Z',
  restroom: 'M3 1.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM11.5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM3.29 4a1 1 0 0 0-.868.504L.566 7.752a.5.5 0 1 0 .868.496l1.412-2.472A345.048 345.048 0 0 0 1 11h2v2.5a.5.5 0 0 0 1 0V11h1v2.5a.5.5 0 0 0 1 0V11h2L6.103 5.687l1.463 2.561a.5.5 0 1 0 .868-.496L6.578 4.504A1 1 0 0 0 5.71 4H3.29ZM9 4.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v4a.5.5 0 0 1-1 0v-4h-1v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1-1 0v-5Z',
  stairs: 'M15 1V2H12V4V5H11H9V7V8H8H6V10V11H5H3V13V14H2H0V13H2V11C2 10.4477 2.44772 10 3 10H5V8C5 7.44772 5.44772 7 6 7H8V5C8 4.44772 8.44771 4 9 4H11V2C11 1.44772 11.4477 1 12 1L15 1Z',
  dining: 'M3.5,0l-1,5.5c-0.1464,0.805,1.7815,1.181,1.75,2L4,14c-0.0384,0.9993,1,1,1,1s1.0384-0.0007,1-1L5.75,7.5 c-0.0314-0.8176,1.7334-1.1808,1.75-2L6.5,0H6l0.25,4L5.5,4.5L5.25,0h-0.5L4.5,4.5L3.75,4L4,0H3.5z M12,0 c-0.7364,0-1.9642,0.6549-2.4551,1.6367C9.1358,2.3731,9,4.0182,9,5v2.5c0,0.8182,1.0909,1,1.5,1L10,14c-0.0905,0.9959,1,1,1,1 s1,0,1-1V0z',
  library: 'M1.0819,9.9388C0.9871,9.867,1.0007,9.7479,1.0007,9.7479L1.5259,3.5c0,0,0.0082-0.0688,0.0388-0.104 C1.584,3.374,1.6084,3.342,1.6544,3.3232C2.1826,3.1072,5.0537,1.5519,6.5,3c0.2397,0.2777,0.4999,0.6876,0.4999,1v5.2879 c0,0,0.0062,0.1122-0.0953,0.1801c-0.0239,0.016-0.124,0.0616-0.242,0.0026c-2.2253-1.1134-4.711,0.1546-5.3381,0.4871 C1.1987,10.0244,1.1006,9.9531,1.0819,9.9388z M13.6754,9.9577c-0.6271-0.3325-3.1128-1.6005-5.3381-0.4871 c-0.118,0.059-0.2181,0.0134-0.242-0.0026C7.9939,9.4001,8.0001,9.2879,8.0001,9.2879V4c0-0.3124,0.2602-0.7223,0.4999-1 c1.4463-1.4481,4.2991,0.1071,4.8273,0.3232c0.046,0.0188,0.0704,0.0508,0.0897,0.0728C13.4476,3.4312,13.4558,3.5,13.4558,3.5 l0.5435,6.2479c0,0,0.0136,0.1191-0.0812,0.1909C13.8994,9.9531,13.8013,10.0244,13.6754,9.9577z M8.8647,12.6863 c0.0352-0.0085,0.0964-0.0443,0.1179-0.0775c0.0236-0.0364,0.0378-0.0617,0.0423-0.1088c0.0495-0.9379,1.6245-1.8119,4.6477-0.0298 c0.0775,0.0441,0.1666,0.0396,0.2425-0.0155C14.0014,12.392,14,12.2859,14,12.2859v-0.5542c0,0,0.0003-0.0764-0.0272-0.1184 c-0.0205-0.0312-0.0476-0.0643-0.0926-0.0858c-2.0254-1.3145-4.5858-1.8972-5.8854-0.1592 c-0.0181,0.0423-0.0353,0.0613-0.0728,0.0905C7.8654,11.5028,7.7964,11.5,7.7964,11.5H7.2109c0,0-0.069,0.0028-0.1256-0.0412 c-0.0375-0.0292-0.0547-0.0482-0.0728-0.0905c-1.2996-1.738-3.86-1.1828-5.8854,0.1317c-0.045,0.0215-0.0721,0.0546-0.0926,0.0858 c-0.0275,0.042-0.0272,0.1184-0.0272,0.1184v0.5542c0,0-0.0014,0.1061,0.0849,0.1688c0.0759,0.0551,0.165,0.0596,0.2425,0.0155 c3.0232-1.7821,4.5982-0.8806,4.6477,0.0573c0.0045,0.0471,0.0187,0.0724,0.0423,0.1088c0.0215,0.0332,0.0827,0.069,0.1179,0.0775 C6.8645,12.8656,7.9112,12.9363,8.8647,12.6863z',
  parking: 'M4 2V13H6V9H8.5C10.433 9 12 7.433 12 5.5C12 3.567 10.433 2 8.5 2H4ZM6 7V4H8.5C9.32843 4 10 4.67157 10 5.5C10 6.32843 9.32843 7 8.5 7H6Z',
  vestibule: 'M6.554,9.639a.5.5,0,0,0,.707.707L9.928,7.669a.25.25,0,0,0,0-.354h0L7.261,4.639a.5.5,0,0,0-.707.707L8.2,7H1.5a.5.5,0,0,0,0,1H8.2ZM12,1H5.5a.5.5,0,0,0,0,1h6a.5.5,0,0,1,.5.5v10a.5.5,0,0,1-.5.5H5.25a.5.5,0,0,0,0,1H12a1,1,0,0,0,1-1V2A1,1,0,0,0,12,1Z',
  auditorium: 'M9.5 5L10.57 3.46C10.6299 3.4646 10.6901 3.4646 10.75 3.46C11.4404 3.4596 11.9997 2.8997 11.9994 2.2094C11.999 1.519 11.4391 0.959599 10.7487 0.959999C10.0584 0.960399 9.499 1.5203 9.4994 2.2106C9.4994 2.2237 9.4996 2.2368 9.5 2.25C9.5 2.25 9.5 2.32 9.5 2.35L7 5H9.5ZM12 7V6H3V7L4.5 10.5L3 14V15H12V14L11 10.5L12 7Z',
  study: 'M1.78483 3.81169C2.03375 3.31421 2.54231 3 3.09859 3C3.48821 3 3.86186 3.15477 4.13736 3.43027L4.85354 4.14645C5.0488 4.34171 5.0488 4.65829 4.85354 4.85355C4.65827 5.04882 4.34169 5.04882 4.14643 4.85355L3.43017 4.1373C3.34226 4.04939 3.22303 4 3.09871 4C2.92116 4 2.75884 4.10032 2.67944 4.25912L1.309 7H5.2476C6.0654 7 6.7487 7.5656 6.941 8.3245C7.1146 8.2834 7.3009 8.25 7.5 8.25C7.6991 8.25 7.8854 8.2835 8.059 8.3246C8.2513 7.5656 8.9344 7 9.752 7H13.691L12.3206 4.25912C12.2412 4.10032 12.0788 4 11.9013 4C11.777 4 11.6577 4.04939 11.5698 4.1373L10.8536 4.85355C10.6583 5.04882 10.3417 5.04882 10.1465 4.85355C9.9512 4.65829 9.9512 4.34171 10.1465 4.14645L10.8626 3.43027C11.1381 3.15477 11.5118 3 11.9014 3C12.4577 3 12.9663 3.31421 13.2152 3.81169L14.9414 7.26172L14.9404 7.26308C14.9784 7.33359 15 7.41428 15 7.5V8.5C15 8.7761 14.7761 9 14.5 9H14V9.5C14 11.0889 12.998 12 11.25 12H10.75C9.002 12 8 11.0889 8 9.5V9.3413C7.8499 9.2933 7.6693 9.25 7.5 9.25C7.3307 9.25 7.1503 9.2933 7 9.3413V9.5C7 11.0889 5.9976 12 4.25 12H3.75C2.0024 12 1 11.0889 1 9.5V9H0.4992C0.2235 9 0 8.7765 0 8.5007V7.5C0 7.41428 0.0215731 7.33359 0.0595866 7.26308L0.0585938 7.26172L1.78483 3.81169ZM9.752 8C9.3369 8 9 8.3374 9 8.7524V9.5C9 10.1982 9.1992 11 10.75 11H11.25C12.8008 11 13 10.1982 13 9.5V8.7529C13 8.3379 12.6621 8 12.2471 8H9.752ZM2.7529 8C2.3379 8 2 8.3374 2 8.7524V9.5C2 10.1982 2.1987 11 3.75 11H4.25C5.8013 11 6 10.1982 6 9.5V8.7524C6 8.3374 5.6626 8 5.2475 8H2.7529Z',
  studio: 'M5.542 3.647 3.106 3l.443-1.63a.505.505 0 0 1 .618-.352l1.46.392a.5.5 0 0 1 .355.613l-.44 1.624Zm-4.52 7.356a.496.496 0 0 1-.005-.276l1.819-6.726 2.435.647-1.819 6.726a.499.499 0 0 1-.143.237l-1.457 1.347a.152.152 0 0 1-.247-.066l-.583-1.889ZM10 5c-2.25 0-3-.75-3-3 2.25 0 3 .75 3 3Zm-1.4 7.984c-1.37.21-3.126-1.706-3.52-3.8L5.969 5.9c.399-.35.903-.533 1.419-.533a2.71 2.71 0 0 1 1.564.489.964.964 0 0 0 1.089-.01 2.438 2.438 0 0 1 1.46-.479c.77 0 1.643.489 2.05 1.201 1.536 2.696-1.194 6.709-3.144 6.417a.867.867 0 0 1-.255-.093 1.427 1.427 0 0 0-1.302 0 .866.866 0 0 1-.25.092Z',
  store: 'm13.33 5h-1.83l-.39-2.33c-.1601-.7182-.7017-1.2905-1.41-1.49-.3493-.1124-.7131-.173-1.08-.18h-2.24c-.3669.007-.7307.0676-1.08.18-.7083.1995-1.2499.7718-1.41 1.49l-.39 2.33h-1.83c-.2761-.0017-.5013.2208-.503.497-.0003.0519.0074.1035.023.153l1.88 6.3c.1964.6246.7753 1.0496 1.43 1.05h6c.651-.0047 1.2247-.4289 1.42-1.05l1.88-6.3c.0829-.2634-.0635-.5441-.3269-.627-.0463-.0146-.0945-.0223-.1431-.023zm-8.81 0 .36-2.17c.0807-.3625.3736-.6395.74-.7.2463-.0776.5019-.1213.76-.13h2.24c.2614.0078.5205.0515.77.13.3664.0605.6593.3375.74.7l.35 2.17h-6z',
  workshop: 'M13.7919,3.2619c0,0-1.676,1.675-2.1163,2.1208c-0.085,0.0861-0.1688,0.1135-0.282,0.0961 c-0.1481-0.0226-0.2974-0.038-0.4462-0.0558c-0.4072-0.0485-0.8145-0.0966-1.2292-0.1458C9.649,4.6852,9.5787,4.1049,9.5177,3.5236  C9.512,3.4689,9.5509,3.3943,9.5925,3.3522c0.5071-0.5134,1.9261-1.9287,2.134-2.136c-0.4508-0.2129-1.2243-0.2968-1.8007-0.2031  c-2.1801,0.3543-3.5112,2.534-2.8206,4.625C7.1432,5.753,7.1194,5.8201,7.0374,5.902C5.1891,7.7454,3.3436,9.5914,1.498,11.4374  c-0.0616,0.0616-0.1231,0.124-0.1779,0.1913c-0.5264,0.6473-0.3873,1.6264,0.2974,2.102c0.6044,0.4197,1.3658,0.3442,1.9053-0.1948  c1.8534-1.8519,3.7059-3.7047,5.556-5.5598C9.1707,7.884,9.2437,7.8526,9.3779,7.8983c0.6189,0.2109,1.2524,0.2354,1.8884,0.0884  c1.9386-0.4478,3.1251-2.3732,2.6549-4.3034C13.8895,3.5532,13.843,3.4244,13.7919,3.2619z',
  classroom: 'M7.5,1L0,4.5l2,0.9v1.7C1.4,7.3,1,7.9,1,8.5s0.4,1.2,1,1.4V10l-0.9,2.1 C0.8,13,1,14,2.5,14s1.7-1,1.4-1.9L3,10c0.6-0.3,1-0.8,1-1.5S3.6,7.3,3,7.1V5.9L7.5,8L15,4.5L7.5,1z M11.9,7.5l-4.5,2L5,8.4v0.1  c0,0.7-0.3,1.3-0.8,1.8l0.6,1.4v0.1C4.9,12.2,5,12.6,4.9,13c0.7,0.3,1.5,0.5,2.5,0.5c3.3,0,4.5-2,4.5-3L11.9,7.5L11.9,7.5z',
  sport: 'M14.5,7V8h-1v2h-1v1H11V8H4v3H2.5V10h-1V8H.5V7h1V5h1V4H4V7h7V4h1.5V5h1V7Z',
};

interface RoomPinProps {
  room: Room;
}

export function hasIcon(room: Room) {
  return room.type in icons;
}

/**
 * The marker displayed for identifying the type of a room.
 * Visible on the map and in the search results.
 */
export default function RoomPin({ room }: RoomPinProps) {
  const icon = icons[room.type] ?? null;
  const showIcon = icon !== null;

  const roomColors = getRoomTypeDetails(room.type);

  return (
    <div
      className={clsx(
        styles.pin,
        showIcon && styles['pin-with-icon'],
      )}
      style={{ background: roomColors.primary }}
      title={titleCase(room.type)}
    >
      {showIcon && (
        <svg xmlns="http://www.w3.org/2000/svg" id="elevator" width="15" height="15" viewBox="0 0 15 15">
          <path d={icon} fill={room.type !== 'vestibule' ? 'white' : 'black'} />
        </svg>
      )}
    </div>

  );
}
