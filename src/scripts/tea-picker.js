"use strict";

/**
 * TEA PICKER
 *
 * Spin the wheel to pick who should make
 * the next round of Tea for the team.
 */

import { TweenMax } from "gsap/TweenMax";
import Winwheel from "winwheel";

/**
 * CONSTRUCTOR
 * initialises the object
 */
class TeaPicker {
  constructor(el, options) {
    this.el = el;

    // Options
    this.settings = {
      ...{
        endpoint:
          "https://putnam-storage.s3.eu-west-2.amazonaws.com/members.json",
        participants: [],
        addedMembers: [],
        wheel: null,
        searchInput: document.querySelector(".js-search"),
        suggestions: document.querySelector(".js-suggestions"),
        spinTrigger: document.querySelector(".js-spin-trigger"),
        resetTrigger: document.querySelector(".js-reset-trigger"),
        choosenMembers: document.querySelector(".js-selected-members"),
        segmentCount: 0
      },
      ...options
    };

    if (localStorage.getItem("participants") === null) {
      this.fetchAvailTeamMembers();
    } else {
      this.settings.participants = JSON.parse(
        localStorage.getItem("participants")
      );
    }

    this.init();
  }

  init() {
    this.createWheel();
    this.addListeners();
    this.settings.wheel.animation.callbackFinished = this.alertPrize.bind(this);
  }

  addListeners() {
    this.settings.searchInput.addEventListener("change", this.displayMatches);
    this.settings.searchInput.addEventListener("keyup", this.displayMatches);

    this.settings.suggestions.addEventListener("click", input => {
      this.addSegment(input.target);
    });

    this.settings.spinTrigger.addEventListener("click", () => {
      this.spinWheel();
    });

    this.settings.resetTrigger.addEventListener("click", () => {
      this.resetWheel();
    });
  }

  createWheel = () => {
    this.settings.wheel = new Winwheel({
      numSegments: 0,
      textFontSize: 20,
      responsive: true,
      lineWidth: 1,
      animation: {
        type: "spinToStop",
        duration: 5,
        spins: 8
      }
    });
  };

  drawTriangle() {
    const node = document.createElement("div");
    node.classList.add("triangle", "absolute");
    document.querySelector(".canvas-container").append(node);
  }

  addSegment(person) {
    if (
      this.settings.wheel.numSegments >= 5 ||
      this.settings.addedMembers.includes(person.textContent)
    ) {
      return;
    }

    this.settings.wheel.addSegment(
      {
        text: person.textContent,
        textFontFamily: "Roboto",
        fillStyle: "#22ff5f",
        strokeStyle: "white",
        textFillStyle: "white"
      },
      1
    ); // The draw method of the wheel object must be called in order for the changes // to be rendered.
    this.settings.wheel.draw();

    this.settings.segmentCount = this.settings.wheel.numSegments;

    if (this.settings.segmentCount >= 2) {
      this.settings.spinTrigger.classList.remove("hidden");
    }

    this.settings.addedMembers.push(person.textContent);

    this.drawTriangle();
  }

  resetWheel() {
    this.settings.wheel.stopAnimation(false); // Stop the animation, false as param so does not call callback function.
    this.settings.wheel.rotationAngle = 0; // Re-set the wheel angle to 0 degrees.
    this.settings.wheel.draw();
  }

  alertPrize() {
    let winningSegment = this.settings.wheel.getIndicatedSegment();

    alert("You have won " + winningSegment.text + "!");

    this.settings.resetTrigger.classList.remove("hidden");
  }

  spinWheel() {
    this.settings.wheel.startAnimation();
  }

  fetchAvailTeamMembers = () => {
    let options = {
      method: "GET"
    };

    let req = new Request(this.settings.endpoint, options);

    fetch(req)
      .then(resp => resp.json())
      .then(
        function(data) {
          this.settings.participants.push(...data);
          localStorage.setItem(
            "participants",
            JSON.stringify(this.settings.participants)
          );
        }.bind(this) // Bind this so we have access to global element via this
      )
      .catch(console.error());
  };

  findMatches = (wordToMatch, participants) => {
    return participants.filter(member => {
      // here we need to figure out if the city or state matches what was searched
      const regex = new RegExp(wordToMatch, "gi");
      return member.name.match(regex);
    });
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  displayMatches = el => {
    const matchArray = this.findMatches(
      el.target.value,
      this.settings.participants
    );
    const html = matchArray
      .map(member => {
        return `
      <li class="item">
        <a href="#" class=" h-full js-member justify-between name p-2 w-full"> ${
          member.name
        }</a>
        </div>
      </li>
    `;
      })
      .join("");
    this.settings.suggestions.innerHTML = html;
  };
}

export default TeaPicker;
