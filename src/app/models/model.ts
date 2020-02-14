export  class Section {
  id: number;
  retroId: string;
  header: string;
  cards: Card[];
}

export  class Card {
  id: number;
  retroId: string;
  sectionId: number;
  header: string;
  content: string;
  likes: number;
}
