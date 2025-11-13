import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'loader',
  templateUrl: './loader.html',
  styles: [`:host { display: contents; }
  :host .loader{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    margin: 0 auto;
    bottom: 0;
    background: #0000001c;
    opacity: .5;
  }
  :host h1{
    font-family: 'Actor', sans-serif;
    color:#FFF;
    font-size:16px;
    letter-spacing:1px;
    font-weight:200;
    text-align:center;
    margin-bottom: 30px;
  }
  :host .loader span{
    width:8px;
    height:8px;
    border-radius:50%;
    display:inline-block;
    position:absolute;
    left:50%;
    margin-left:-10px;
    -webkit-animation:3s infinite linear;
    -moz-animation:3s infinite linear;
    -o-animation:3s infinite linear;

  }


  :host .loader span:nth-child(2){
    background:#E84C3D;
    -webkit-animation:kiri 1.2s infinite linear;
    -moz-animation:kiri 1.2s infinite linear;
    -o-animation:kiri 1.2s infinite linear;

  }
  :host .loader span:nth-child(3){
    background:#F1C40F;
    z-index:100;
  }
  :host .loader span:nth-child(4){
    background:#2FCC71;
    -webkit-animation:kanan 1.2s infinite linear;
    -moz-animation:kanan 1.2s infinite linear;
    -o-animation:kanan 1.2s infinite linear;
  }


  @-webkit-keyframes kanan {
    0% {-webkit-transform:translateX(20px);
    }

    50%{-webkit-transform:translateX(-20px);
    }

    100%{-webkit-transform:translateX(20px);
      z-index:200;
    }
  }
  @-moz-keyframes kanan {
    0% {-moz-transform:translateX(20px);
    }

    50%{-moz-transform:translateX(-20px);
    }

    100%{-moz-transform:translateX(20px);
      z-index:200;
    }
  }
  @-o-keyframes kanan {
    0% {-o-transform:translateX(20px);
    }

    50%{-o-transform:translateX(-20px);
    }

    100%{-o-transform:translateX(20px);
      z-index:200;
    }
  }

  @-webkit-keyframes kiri {
    0% {-webkit-transform:translateX(-20px);
      z-index:200;
    }
    50%{-webkit-transform:translateX(20px);
    }
    100%{-webkit-transform:translateX(-20px);
    }
  }

  @-moz-keyframes kiri {
    0% {-moz-transform:translateX(-20px);
      z-index:200;
    }
    50%{-moz-transform:translateX(20px);
    }
    100%{-moz-transform:translateX(-20px);
    }
  }
  @-o-keyframes kiri {
    0% {-o-transform:translateX(-20px);
      z-index:200;
    }
    50%{-o-transform:translateX(20px);
    }
    100%{-o-transform:translateX(-20px);
    }
  }

  `],
  standalone: true, imports: [ CommonModule ]
})
export class LoaderComponent {
  @Input() isLoading: boolean;
  @Input() count: number;
  constructor() {}
}
