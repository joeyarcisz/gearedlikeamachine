import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* ──────────────────────────────────────────────
   1. LOGO MARK — Brand gear + play button
   Uses currentColor with opacity layers for depth.
   Structural = 100%, depth = 55%, negative space = 8%
   ────────────────────────────────────────────── */
export function GearPlayLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Outer gear */}
      <path fill="currentColor" d="M512.54 171.59Q557.2 171.59 562.75 171.66 568 171.74 574.57 174.97C582.48 178.88 587.27 188.04 588.64 196.49Q594 229.47 595.28 235.88C597.38 246.44 603.69 255.5 613.28 260.71Q627.44 268.4 643.71 261.39 649.2 259.01 656.73 253.47 667 245.9 680.45 235.17C690.54 227.11 703.22 224.39 714.88 230.3Q719.32 232.55 729.18 242.88 734.48 248.43 787.03 302.16 792.34 307.59 794.03 311.05 799.52 322.32 795.47 334.5 794.03 338.83 788.59 345.94 774.3 364.6 770.31 369.77C764.13 377.78 759.7 387.9 760.18 398.1 760.95 414.66 772.61 427.65 788.75 431.02Q797.46 432.85 820.76 435.93C835.03 437.82 847.16 440.67 852.25 455.6Q853.67 459.75 853.68 468.34 853.76 505.85 853.74 552.68 853.74 564.55 852.23 568.74C847.89 580.86 838.05 586.28 825.74 587.71Q803.01 590.35 786.48 593.67 783.43 594.29 778.13 597.14C762.81 605.39 756.57 623.79 762.36 639.87Q765.21 647.77 770.08 654.01 788.71 677.85 792.04 682.97C798.33 692.65 798.99 704.75 793.17 714.78Q791.46 717.74 786.17 723.15 732.99 777.56 724.15 786.66 709.88 801.35 690.05 794.66 686.5 793.47 680.19 788.54 669.61 780.28 652.92 767.81C643.58 760.84 631.77 757.32 620.36 760.35Q604.88 764.47 597.96 779.71 596.06 783.9 594.77 791.26 592.47 804.47 589.17 825.49C586.67 841.45 577.38 852.42 560 852.46Q559.05 852.47 512.58 852.47 466.12 852.47 465.17 852.47C447.79 852.43 438.49 841.46 435.99 825.5Q432.69 804.48 430.39 791.27 429.1 783.91 427.2 779.72 420.27 764.48 404.79 760.36C393.38 757.34 381.57 760.86 372.23 767.83Q355.55 780.3 344.97 788.56 338.66 793.49 335.11 794.68 315.28 801.38 301.01 786.69 292.17 777.59 238.98 723.19 233.69 717.78 231.98 714.82C226.16 704.79 226.81 692.69 233.1 683.01Q236.43 677.89 255.06 654.05 259.93 647.8 262.78 639.9C268.57 623.82 262.32 605.42 247 597.18Q241.7 594.33 238.65 593.71 222.12 590.39 199.39 587.75C187.08 586.32 177.24 580.91 172.9 568.79Q171.39 564.6 171.39 552.73 171.36 505.9 171.43 468.39 171.44 459.8 172.86 455.65C177.95 440.72 190.08 437.86 204.35 435.97Q227.65 432.89 236.36 431.06C252.5 427.69 264.16 414.69 264.92 398.13 265.4 387.93 260.97 377.81 254.79 369.81Q250.8 364.64 236.51 345.98 231.07 338.87 229.63 334.54 225.57 322.36 231.06 311.09 232.75 307.63 238.06 302.2 290.6 248.46 295.9 242.91 305.76 232.58 310.2 230.33C321.86 224.42 334.54 227.13 344.63 235.19Q358.08 245.92 368.35 253.49 375.89 259.03 381.38 261.41 397.65 268.42 411.81 260.72C421.39 255.51 427.7 246.45 429.8 235.89Q431.08 229.48 436.44 196.5C437.81 188.05 442.59 178.89 450.5 174.98Q457.07 171.75 462.33 171.67 467.87 171.59 512.54 171.59Z"/>
      {/* Inner detail 1 — depth layer */}
      <path fill="currentColor" fillOpacity={0.55} d="M253.08 364.04Q248.97 358.23 235.96 341.93 232.96 338.16 231.52 332.13 228.02 317.5 237.99 307.23C242.6 302.47 250.71 294.6 259.13 287.09Q263.8 282.93 266.64 279.01 270.52 273.65 273.01 271.59 273.5 271.18 289.32 255C295.37 248.81 301.16 241.82 307.92 235.67Q313.29 230.79 319.38 230.19 327.13 229.43 334.16 231.91A8.11 8.08-18.6 0 1 335.86 232.75Q344.2 238.19 349.22 242.75 351.55 244.87 355.41 247.4 357.84 248.99 361.42 252.15A5.59 5.53-9.3 0 0 362.42 252.86Q365.67 254.65 368.07 257.29A5.09 4.85-5.8 0 0 369.37 258.3Q382.38 265.24 390.78 267.18 393.02 267.69 400.35 267.63A10.05 9.97 34.1 0 0 403.79 266.98Q405.57 266.31 412.21 264.19 413.95 263.64 418.25 260.84A4.99 4.75-84.6 0 0 419.24 259.98Q428.6 249.04 432.88 235.46 433.78 232.61 434.01 230.22C434.23 227.89 435 225.93 435.4 223.17 435.81 220.42 435.86 217.18 436.61 213.96Q437.23 211.3 437.5 206.76A16.81 15.97-38.3 0 1 437.88 204.1C438.89 199.52 439.16 196.18 440.38 192.39Q444.23 180.39 455.92 176.05 460.65 174.29 474.48 174.19 523.31 173.81 564.01 175.11A0.53 0.48 47.9 0 1 564.11 175.12L570.35 176.28A2.11 2.03 62 0 1 570.87 176.45Q582.94 181.86 585.7 194.76 588.01 205.52 589.08 214.93C589.41 217.79 590.69 221.54 591.16 225.07Q592.35 234.01 593.8 239.96 595.71 247.75 600.68 253.69C603.33 256.85 606.23 260.37 609.05 261.7Q613.15 263.65 615.82 265.2A6.1 6-20.7 0 0 617.02 265.73Q624 267.99 631.6 267.44C634.71 267.22 637.96 265.82 641.28 265.26A11.16 11.15-60.7 0 0 643.59 264.61C647.81 262.92 652.29 261.49 655.8 258.8Q667.87 249.55 684.76 236.89 686.42 235.65 689.2 234.15 690.46 233.47 693.05 231.72A4.39 4.35-68.2 0 1 694.48 231.1Q703.79 228.94 713.36 232.46A3.58 3.48-7.8 0 1 714.96 233.64Q716.44 235.62 719.31 238.05 721.36 239.78 723.66 242.38 733.85 253.87 742.86 263.7C751.71 273.35 759.14 279.8 769.77 289.72 771.79 291.61 774.77 295.2 777.73 297.77Q782.96 302.33 788.16 308.13C795.8 316.66 796.57 330.57 789.53 339.76Q783.83 347.2 778.19 354.72C776.5 356.98 774.19 358.59 772.75 360.91Q770.05 365.25 767.32 369.05C764.74 372.64 763.54 375.54 761.57 379.6 756.13 390.78 757.3 404.11 762.87 415.13Q768.01 425.31 777.94 430.68 782.07 432.92 792.78 435.14 801.35 436.92 826.43 439.3 829 439.54 836.41 442.2C843.63 444.8 848.01 450.84 850.02 457.99Q850.79 460.73 850.79 467.21C850.78 477.78 851 484.02 850.55 494.91Q850.02 507.63 850.2 514.97 850.68 534.61 850.46 553.65C850.32 566.48 849.01 573.5 839.64 580.26Q836.63 582.43 826.63 584.33 808.61 587.76 793.7 589.17 792.12 589.32 784.61 591.48 779.56 592.93 776.07 595.17 765.34 602.05 760.36 613.85C755.87 624.49 757.79 637.29 762.5 647.28 766.26 655.24 771.94 661.82 779.28 671.09 783.13 675.95 786.66 679.61 789.46 684.03 794.23 691.54 795.42 698.71 793.2 707.22 790.36 718.09 780.97 722.03 773.45 730.7Q768.72 736.16 761.78 742.38C756.42 747.18 752.81 752.57 747.4 757.58Q742.61 762.02 737 767.82C732.67 772.29 727.88 776.72 723.9 781.9Q720.8 785.92 716.18 789.69C707.8 796.52 696.05 795.94 686.91 790.8 683.78 789.04 679.43 786.17 676.37 783.68Q659.44 769.89 652.27 765.02 646.53 761.12 639.1 758.74 631.45 756.28 624.93 756.98C607.33 758.89 596.62 772.05 593.01 788.52Q591.89 793.62 586.82 823.08C585.71 829.53 584.05 838.07 578.09 843.33 571.33 849.28 565.15 849.86 556.38 849.87Q505.47 849.92 463.87 849.84C458.82 849.83 452.84 848.23 448.67 845.12Q447.85 844.51 446.01 842.47 440.16 836.03 439.19 829.49C438.23 822.97 437.3 818.58 437.24 814.21 437.21 812.34 436.55 810.77 436.29 808.93Q434.44 795.9 434.25 794.53A1.66 1.56 30.7 0 0 434.1 794.01Q433.05 791.64 432.23 788.14 431.68 785.79 430.4 782.53 428.69 778.14 427.22 774.86A3.2 3.13 12.8 0 0 426.69 774.04Q426.19 773.45 422.65 769.25C415.72 761.03 405.52 756.85 394.75 757.23Q386.18 757.54 374.27 763.01A3 2.84 8.4 0 0 373.44 763.59Q371.3 765.69 361.88 772.37 359.44 774.1 344.05 786.44C341.93 788.14 340.72 789.63 338.09 790.87Q332.76 793.38 327.52 794.28C316.05 796.26 307.13 790.56 299.6 782.73Q267.26 749.14 261.59 743.41 249.82 731.53 241.65 723.24 234.58 716.08 232.81 712.05C229.35 704.19 229.85 693.41 234.26 686.03Q236.81 681.76 239.63 678.73 242.58 675.57 245.3 671.74C249.9 665.28 255.83 658.5 260.97 650.38Q262.88 647.36 263.87 644.23 263.94 643.98 266.47 637.69A11.37 11.1-32.8 0 0 267.25 634.28L267.75 627.09A6.41 6.32 39.7 0 0 267.54 625C266.46 621.11 265.64 616.04 263.38 611.76Q260.34 605.97 259.26 604.68 252.61 596.67 242.69 592.76 241.17 592.16 237.09 590.84A20.25 19.43-31.8 0 0 233.19 590.01Q228.78 589.52 222.29 588.47 204.68 585.62 197.97 584.76 191.12 583.88 186.26 581.56 185.13 581.02 179.97 576.23A3.52 3.32-85.6 0 1 179.34 575.45Q174.77 567.63 174.75 561.49 174.66 533.91 174.89 515.66C175.07 500.71 174.25 484.89 174.45 468.01Q174.54 460.42 176.92 454.94 177.76 453.02 185 444.53A2.43 2.36-81.6 0 1 185.81 443.91Q189.97 441.94 194.21 441C202.69 439.12 211.87 437.53 220.83 436.75 231.48 435.83 242.77 434.47 252.02 428.84Q260.08 423.93 264.95 412.94 265.79 411.03 267.36 403.89C270.07 391.54 263.3 377.74 255.95 366.48A1.78 1.75-4.6 0 0 255.17 365.83Q253.99 365.34 253.08 364.04Z"/>
      {/* Inner structure */}
      <path fill="currentColor" d="M441.43 354.64Q453.81 348.51 467.04 345.37 487.8 340.43 507.04 339.06C520.93 338.08 534.21 340.38 548.21 343.06Q553.62 344.1 556.12 345.04C560.21 346.58 565.19 347.07 568.48 348.5Q581.58 354.18 591.37 359.23C596.19 361.71 599.61 364.84 604.45 367.02A7.58 7.43-13.6 0 1 605.89 367.88Q623.44 381.1 627.87 385.38 633.34 390.65 636.26 393.5A5.39 5.08 7.8 0 1 637.1 394.54C639.35 398.17 642.45 400.95 645.14 404.37Q651.9 412.97 656.18 418.7A5.1 4.91 15.3 0 1 656.75 419.66Q657.92 422.27 659.98 424.96A10.45 10.4 13.9 0 1 661.12 426.84Q667.07 439.48 671.66 449.53C673.08 452.64 673.91 457.8 675.13 461.54Q678.91 473.11 679.99 479.21C684.96 507.32 683.97 537.05 675.46 564.51Q673.62 570.44 671.73 574.23 664.78 588.11 660.06 598.19A30.92 30.69-14.5 0 1 657.08 603.21C652.61 609.31 648.77 615.67 643.8 621.24Q634.02 632.2 631.58 634.59 613.04 652.75 589.35 664.13 572.42 672.26 553.03 677.6 546.89 679.29 541.63 679.62C537.49 679.88 531.53 681.05 526.18 681Q511.7 680.89 506.46 681.16 501.41 681.42 497.95 680.86C491.64 679.84 484.82 679.99 478.8 678.55 474.34 677.49 469.61 677.13 464.72 675.54Q454.91 672.35 442.08 667.29C438.04 665.7 435.27 663.86 431.56 662.09Q430.16 661.42 427.52 659.72 419.59 654.6 410.36 648.04 405.02 644.25 401.5 640.85C397.51 636.99 390.59 631.27 386.12 626.07 381.08 620.21 378.78 617.72 373.94 611.07Q369.11 604.44 364.57 596.97C363.35 594.96 362.45 592.31 361.08 589.79Q355.44 579.43 352.24 570.02C340.38 535.13 338.65 495.33 349.41 459.6Q350.78 455.05 353.24 449.75 359.08 437.15 364.27 425.79 365.7 422.67 371.92 414.02C375.01 409.71 377.55 405.6 380.93 401.67Q392.76 387.89 406.87 375.81A5.74 5.7 9.7 0 1 407.68 375.24Q410.21 373.8 412.49 371.76A6.62 6.53 10.2 0 1 413.85 370.83Q416.32 369.59 418.41 368.17 428.93 361.03 439.21 356.2 440.3 355.68 440.98 354.97A1.41 1.37 7.9 0 1 441.43 354.64Z"/>
      {/* Circle — negative space */}
      <path fill="currentColor" fillOpacity={0.08} d="M514.65 341.43C528.9 341.6 543.75 344.13 557.51 347.88Q578.19 353.51 596.39 364.25 630.78 384.54 653.06 418.36C675.92 453.07 684.73 496.63 678.21 537.43 672.35 574.07 654.51 607.93 627.29 633.24 595.54 662.76 553.85 678.96 510.63 678.45 467.4 677.93 426.11 660.74 395.08 630.47 368.46 604.52 351.44 570.24 346.45 533.47 340.91 492.53 350.76 449.19 374.44 415.04Q397.52 381.76 432.38 362.29 450.83 351.99 471.64 346.86C485.49 343.43 500.4 341.26 514.65 341.43Z"/>
      {/* Dark ring */}
      <path fill="currentColor" d="M522.49 366.61C560.01 369.19 593.78 386.08 618.88 413.92Q625.87 421.68 632.74 432.26C659.69 473.75 663.47 527.61 641.99 572.3Q626.85 603.78 598.89 624.79C570.63 646.02 537.74 655.67 502.79 653.27 467.85 650.87 436.58 636.81 411.49 611.91Q386.67 587.27 375.98 554.02C360.81 506.81 371.92 453.97 404.3 416.56Q412.55 407.02 420.54 400.29C449.21 376.14 484.97 364.03 522.49 366.61Z"/>
      {/* Inner detail 2 — depth layer */}
      <path fill="currentColor" fillOpacity={0.55} d="M506.97 651.42Q486.15 649.98 472.31 645.88 455.94 641.03 442.07 632.91 436.97 629.92 429.01 624.39 422.55 619.9 417.03 614.42 406.86 604.34 404.11 601.03 395.06 590.08 389.98 580.81 387.29 575.89 383.34 567.4C382.5 565.6 381.79 562.98 380.44 560.91A3.68 3.66 19.8 0 1 379.97 559.92C372.26 535.36 369.73 510.93 374.6 486.36Q376.45 477.02 381.13 462.67 383.78 454.55 390.25 442.18 394.92 433.25 403.1 423.85 419.41 405.11 438.74 391.49C445.02 387.06 450.52 384.51 458.41 380.79 468.61 375.97 480.38 373.35 491.26 371.42 506.12 368.78 520.06 369.11 534.57 371.83 546.01 373.97 552.05 374.55 560.2 378.01 571.54 382.82 583.49 388.62 593.53 396.4 596.96 399.06 603.17 403.11 608.07 407.67Q623.67 422.17 634.45 441.57 641.58 454.41 645.71 466.58C653.46 489.43 654.49 514.33 650.36 538.04Q647.86 552.35 642.01 565.55C638.23 574.09 632.94 584.66 626.93 592.77 620.03 602.11 613.35 609.72 604.47 616.18 600.52 619.04 597.66 622.2 593.19 625.57Q584 632.47 581.91 633.44C567.87 639.94 558.56 644.51 546.45 647.16 539.53 648.67 531.43 650.62 525.09 650.82 518.42 651.02 512.63 651.82 506.97 651.42Z"/>
      {/* Play button background */}
      <path fill="currentColor" d="M573.34 532.08C563.58 537.76 554.55 544.43 544.1 550.07Q537.96 553.39 530.5 558.48C528.22 560.03 524.93 561.56 522.25 563.27Q510.2 570.95 498.66 577.9C489.68 583.31 481.71 587.46 471.19 583.7Q459.95 579.68 457.28 566.7 456.94 565.06 456.65 558.35C456.26 549.49 456.97 541.06 456.78 531.49Q456.64 524.79 456.68 513.05 456.8 470.09 456.87 464.25C456.9 461.33 457.02 457.64 458.24 454.58 460.22 449.57 462.7 444.64 466.89 441.7A1.05 1.03-72.2 0 1 467.08 441.6L473.33 439.14A1.71 1.61 28.2 0 1 473.77 439.02C479.01 438.25 485.95 437.87 490.19 441.34Q497.2 447.06 503.89 450.94 513.86 456.73 515.07 457.7 517.56 459.7 522.42 462.36 525.74 464.18 529.91 466.85 540.82 473.85 543.43 475.63C547.59 478.47 552.11 480.84 557.36 484.34Q559.64 485.86 567.15 490.67 573.51 494.74 573.73 494.88 577.67 497.27 579.66 499.85 584.83 506.53 583.44 516.14 583.43 516.21 582.17 520.88 581.43 523.63 580.26 525.34 577.2 529.83 573.34 532.08Z"/>
      {/* Play triangle — negative space */}
      <path fill="currentColor" fillOpacity={0.08} d="M489.19 443.66L572.85 495.98A18.97 18.97 0 0 1 572.73 528.22L488.71 579.96A18.97 18.97 0 0 1 459.8 563.74L460.16 459.68A18.97 18.97 0 0 1 489.19 443.66Z"/>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   2. SERVICE ICONS (replace emojis)
   ────────────────────────────────────────────── */

/** Smartphone with play button — replaces 📱 */
export function IconSocialMedia(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="5" y1="6" x2="19" y2="6" />
      <line x1="5" y1="18" x2="19" y2="18" />
      <polygon points="10,10 10,16 15,13" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Clapperboard — replaces 🎬 */
export function IconBrandFilm(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 9h16" />
      <path d="M7 4l3 5" />
      <path d="M12 4l3 5" />
      <path d="M17 4l3 5" />
      <path d="M2 4l3 5" />
    </svg>
  );
}

/** Cinema camera — replaces 🎥 */
export function IconLongform(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="15" height="12" rx="2" />
      <polygon points="17,9 22,6 22,18 17,15" />
      <circle cx="7" cy="12" r="2" />
    </svg>
  );
}

/** Bar chart with gear accent — replaces 📊 */
export function IconStrategy(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="14" width="4" height="7" />
      <rect x="10" y="10" width="4" height="11" />
      <rect x="17" y="6" width="4" height="15" />
      {/* Small gear accent */}
      <circle cx="19" cy="4" r="2" />
      <line x1="19" y1="1.5" x2="19" y2="2" />
      <line x1="19" y1="6" x2="19" y2="6.5" />
      <line x1="16.5" y1="4" x2="17" y2="4" />
      <line x1="21" y1="4" x2="21.5" y2="4" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   3. PRODUCTION SPEC ICONS (replace Unicode)
   ────────────────────────────────────────────── */

/** Screen with grid — replaces ◈ */
export function IconResolution(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="4" width="20" height="14" rx="1" />
      <line x1="2" y1="20" x2="22" y2="20" />
      <line x1="10" y1="18" x2="10" y2="20" />
      <line x1="14" y1="18" x2="14" y2="20" />
      {/* Grid pattern */}
      <line x1="8" y1="4" x2="8" y2="18" strokeOpacity="0.4" />
      <line x1="16" y1="4" x2="16" y2="18" strokeOpacity="0.4" />
      <line x1="2" y1="11" x2="22" y2="11" strokeOpacity="0.4" />
    </svg>
  );
}

/** Lens aperture — replaces ◎ */
export function IconCinemaGrade(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="14" y2="8" />
      <line x1="20.66" y1="7" x2="15" y2="10" />
      <line x1="20.66" y1="17" x2="15" y2="14" />
      <line x1="12" y1="22" x2="14" y2="16" />
      <line x1="3.34" y1="17" x2="9" y2="14" />
      <line x1="3.34" y1="7" x2="9" y2="10" />
    </svg>
  );
}

/** Sound waves — replaces ♫ */
export function IconDolbyAudio(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v18" />
      <path d="M8 7v10" />
      <path d="M4 10v4" />
      <path d="M16 7v10" />
      <path d="M20 10v4" />
    </svg>
  );
}

/** Color wheel — replaces ◆ */
export function IconColorGrade(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="22" />
      <line x1="2" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="9.88" y2="9.88" />
      <line x1="14.12" y1="14.12" x2="19.07" y2="19.07" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   4. SOCIAL MEDIA ICONS (replace text abbrevs)
   ────────────────────────────────────────────── */

/** Instagram — rounded square + circle + dot */
export function IconInstagram(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** YouTube — rounded rect + play triangle */
export function IconYouTube(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="4" />
      <polygon points="10,8 10,16 16,12" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Vimeo — play circle */
export function IconVimeo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10,8 10,16 16,12" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** LinkedIn — rounded square with "in" shapes */
export function IconLinkedIn(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <line x1="7" y1="10" x2="7" y2="17" />
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
      <path d="M11 10v7" />
      <path d="M11 13.5c0-2 1.5-3.5 3.5-3.5S18 11.5 18 13.5V17" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   5. DECORATIVE ELEMENTS
   ────────────────────────────────────────────── */

/** Large detailed gear for Hero background — 12 teeth, low opacity, slow CSS spin */
export function GearDecoration(props: IconProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        {/* 12 teeth around the ring */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const innerR = 46;
          const outerR = 56;
          const halfW = 5;
          // Compute tooth rectangle corners
          const cx = 60 + cos * ((innerR + outerR) / 2);
          const cy = 60 + sin * ((innerR + outerR) / 2);
          const hw = halfW;
          const hh = (outerR - innerR) / 2;
          return (
            <rect
              key={i}
              x={cx - hw}
              y={cy - hh}
              width={hw * 2}
              height={hh * 2}
              rx="1"
              transform={`rotate(${i * 30} ${cx} ${cy})`}
            />
          );
        })}
        {/* Outer ring */}
        <circle cx="60" cy="60" r="46" />
        {/* Inner ring */}
        <circle cx="60" cy="60" r="30" />
        {/* Hub */}
        <circle cx="60" cy="60" r="10" />
        {/* Spokes */}
        <line x1="60" y1="50" x2="60" y2="30" />
        <line x1="51.34" y1="55" x2="41.34" y2="41.34" />
        <line x1="51.34" y1="65" x2="41.34" y2="78.66" />
        <line x1="60" y1="70" x2="60" y2="90" />
        <line x1="68.66" y1="65" x2="78.66" y2="78.66" />
        <line x1="68.66" y1="55" x2="78.66" y2="41.34" />
      </g>
    </svg>
  );
}

/** Horizontal line with centered gear — section divider */
export function MechanicalDivider(props: IconProps) {
  return (
    <svg viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" {...props}>
      {/* Left line */}
      <line x1="0" y1="20" x2="175" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      {/* Right line */}
      <line x1="225" y1="20" x2="400" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      {/* Center gear */}
      <g transform="translate(200 20)">
        {/* Teeth */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const cx = Math.cos(angle) * 12;
          const cy = Math.sin(angle) * 12;
          return (
            <rect
              key={i}
              x={cx - 2}
              y={cy - 2}
              width="4"
              height="4"
              rx="0.5"
              fill="currentColor"
              fillOpacity="0.3"
              transform={`rotate(${i * 45} ${cx} ${cy})`}
            />
          );
        })}
        <circle r="9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
        <circle r="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   6. NAVIGATION ICONS (dashboard sidebar)
   ────────────────────────────────────────────── */

/** 2×2 grid — Command Grid / Home */
export function IconGrid(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

/** Play circle — Live Feed / Showreel */
export function IconPlay(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Camera — Portfolio */
export function IconCamera(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

/** Horizontal bars — Capabilities */
export function IconBars(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="16" y2="12" />
      <line x1="4" y1="18" x2="12" y2="18" />
    </svg>
  );
}

/** Timeline — Pipeline / Process */
export function IconTimeline(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <circle cx="12" cy="5" r="2" fill="currentColor" stroke="none" />
      <line x1="14" y1="5" x2="20" y2="5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <line x1="10" y1="12" x2="4" y2="12" />
      <circle cx="12" cy="19" r="2" fill="currentColor" stroke="none" />
      <line x1="14" y1="19" x2="20" y2="19" />
    </svg>
  );
}

/** Wrench — Gear Rentals */
export function IconWrench(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/** Calculator — Scope Tool */
export function IconCalculator(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="8" y1="18" x2="8" y2="18.01" />
      <line x1="12" y1="18" x2="16" y2="18" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   7. AWARD ICONS
   ────────────────────────────────────────────── */

/** Five-pointed star — award badge */
export function IconStar(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   8. LOOKUP MAPS
   ────────────────────────────────────────────── */

export const serviceIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  "social-media": IconSocialMedia,
  "brand-film": IconBrandFilm,
  "longform": IconLongform,
  "strategy": IconStrategy,
};

export const specIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  "resolution": IconResolution,
  "cinema-grade": IconCinemaGrade,
  "dolby-audio": IconDolbyAudio,
  "color-grade": IconColorGrade,
};

export const socialIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  "instagram": IconInstagram,
  "youtube": IconYouTube,
  "vimeo": IconVimeo,
  "linkedin": IconLinkedIn,
};

export const navIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  "grid": IconGrid,
  "play": IconPlay,
  "camera": IconCamera,
  "bars": IconBars,
  "timeline": IconTimeline,
  "wrench": IconWrench,
  "calculator": IconCalculator,
};
