import type { Character, DevilFruitField, GuessShape } from '../backend/types';
import { Comparison } from '../backend/types';

export class GuessCharacter {
  name: string;
  moniker: string;
  imageUrl: string;
  height: string;
  debut: string;
  affiliations: string;
  origin: string;
  age: string;
  status: string;
  bounty: string;
  devilFruit: DevilFruitField;
  difficulty: number;
  index: number;
  constructor(char: Character) {
    this.name = char.name;
    this.moniker = char.moniker;
    this.imageUrl = char.imageUrl;
    this.height = char.height;
    this.debut = char.debut;
    this.affiliations = char.affiliations;
    this.origin = char.origin;
    this.age = char.age;
    this.status = char.status;
    this.bounty = char.bounty;
    this.devilFruit = char.devilFruit;
    this.difficulty = char.difficulty;
    this.index = char.index;
  }
  grabNumber = (text: string) => {
    return Number(text.replace(/\D/g, ''));
  };
  compareHeight = (char: Character) => {
    if (char.height === 'Unknown') {
      if (this.height === 'Unknown') {
        return Comparison.right;
      }
      return Comparison.more;
    }
    const ourHeight = this.grabNumber(this.height);
    const theirHeight = this.grabNumber(char.height);
    if (ourHeight === theirHeight) return Comparison.right;
    if (ourHeight > theirHeight) return Comparison.more;
    if (ourHeight < theirHeight) return Comparison.less;
    return Comparison.wrong;
  };
  compareMangaDebut = (char: Character) => {
    const ourDebut = this.grabNumber(char.debut.split(',')[0]);
    const theirDebut = this.grabNumber(char.debut.split(',')[0]);
    if (ourDebut === theirDebut) return Comparison.right;
    if (ourDebut > theirDebut) return Comparison.more;
    if (ourDebut < theirDebut) return Comparison.less;
    return Comparison.wrong;
  };
  compareAnimeDebut = (char: Character) => {
    const ourDebut = this.grabNumber(this.debut.split(',')[1]);
    const theirDebut = this.grabNumber(char.debut.split(',')[1]);

    if (ourDebut === theirDebut) return Comparison.right;
    if (ourDebut > theirDebut) return Comparison.more;
    if (ourDebut < theirDebut) return Comparison.less;
    return Comparison.less;
  };
  compareAffiliations = (char: Character) => {
    const ourAffiliations = this.affiliations.split(',');
    const theirAffiliations = char.affiliations.split(',');
    if (ourAffiliations === theirAffiliations) return { [Comparison.right]: ourAffiliations };
    const correctAffiliations: string[] = [];
    ourAffiliations.forEach((entry) => {
      if (theirAffiliations.includes(entry)) correctAffiliations.push(entry);
    });
    if (correctAffiliations.length > 0) return { [Comparison.some]: correctAffiliations };
    if (correctAffiliations.length === 0) return { [Comparison.wrong]: [] };
    return { [Comparison.wrong]: [] };
  };
  softCompareAffiliations = (char: Character) => {
    const ourAffiliations = this.affiliations.split(',');
    const theirAffiliations = char.affiliations.split(',');
    if (ourAffiliations === theirAffiliations) return Comparison.right;
    const correctAffiliations: string[] = [];
    ourAffiliations.forEach((entry) => {
      if (theirAffiliations.includes(entry)) correctAffiliations.push(entry);
    });
    if (correctAffiliations.length === 0) return Comparison.wrong;
    if (correctAffiliations.length === theirAffiliations.length) return Comparison.right;
    if (correctAffiliations.length > 0) return Comparison.some;
    return Comparison.wrong;
  };
  compareOrigins = (char: Character) => {
    const ourOrigin = this.origin;
    const theirOrigin = char.origin;
    if (ourOrigin.includes(theirOrigin)) {
      return Comparison.right;
    }
    return Comparison.wrong;
  };
  compareAge = (char: Character) => {
    let ourAge = this.age;
    let theirAge = char.age;
    if (ourAge.includes('Unknown')) {
      ourAge = "0";
    }
    if (theirAge.includes('Unknown')) {
      theirAge = "0"
    }
    const ourAgeN = Number(ourAge);
    const theirAgeN = Number(theirAge);
    if (ourAgeN < theirAgeN) return Comparison.less;
    if (ourAgeN > theirAgeN) return Comparison.more;
    if (ourAgeN === theirAgeN) return Comparison.right;
    return Comparison.wrong;
  };
  compareStatus = (char: Character) => {
    // Deceased, Alive, Unknown
    const ourStatus = this.status;
    const theirStatus = char.status;
    if (ourStatus === theirStatus) {
      return Comparison.right;
    }
    if (ourStatus !== theirStatus) {
      return Comparison.wrong;
    }
    return Comparison.wrong;
  };
  compareBounty = (char: Character) => {
    if (this.bounty === char.bounty) return Comparison.right;
    if (this.bounty === 'Unknown') return Comparison.less;
    const ourBounty = Number(this.bounty.replace(',', ''));
    const theirBounty = Number(char.bounty.replace(',', ''));
    if (ourBounty < theirBounty) return Comparison.less;
    if (ourBounty > theirBounty) return Comparison.more;
    if (ourBounty === theirBounty) return Comparison.right;
    return Comparison.wrong;
  };
  compareDevilFruitType = (char: Character) => {
    if (this.devilFruit === 'Unknown') {
      if (char.devilFruit === 'Unknown') return Comparison.right;
      return Comparison.wrong;
    }
    if (Array.isArray(this.devilFruit)) {
      const ourDFType = this.devilFruit[0].type;
      if (Array.isArray(char.devilFruit)) {
        const theirDFType = char.devilFruit[0].type;
        if (ourDFType === theirDFType) return Comparison.right;
      }
      return Comparison.wrong;
    } else {
      const ourDFType = this.devilFruit.type;
      if (Array.isArray(char.devilFruit)) return Comparison.wrong;
      else if (char.devilFruit === 'Unknown') {
        return Comparison.wrong;
      } else {
        const theirDFType = char.devilFruit.type;
        if (theirDFType === ourDFType) return Comparison.right;
      }
    }
    return Comparison.wrong;
  };
  compareAll = (char: Character): GuessShape => {
    return {
      name: char.name,
      height: this.compareHeight(char),
      // mDebut: this.compareMangaDebut(char),
      debut: this.compareAnimeDebut(char),
      affiliations: this.softCompareAffiliations(char),
      origin: this.compareOrigins(char),
      age: this.compareAge(char),
      status: this.compareStatus(char),
      bounty: this.compareBounty(char),
      devilFruit: this.compareDevilFruitType(char),
    };
  };
}
