import { Injectable } from "@angular/core";
import { ID } from "@datorama/akita";
import { DemoStore } from "./demo.store";
import { WishItem } from "../../../models/WishItem";
import { WishList } from "../../../models/WishList";

@Injectable({ providedIn: "root" })
export class DemoService {
  private defaultWishs: WishItem[] = [
    {
      id: 4785074604081152,
      listId: "cadeaux-noel",
      listTitle: null,
      owner: {
        email: "kieffersuzanne@gmail.com",
        name: "kieffersuzanne@gmail.com"
      },
      suggest: false,
      deleted: false,
      archived: false,
      label: "vol hélicoptère",
      description:
        '<p><b style="background-color: rgb(255, 255, 0);"><span style="font-size: 24px;">Mon rêve !!!</span></b></p>',
      price: "300",
      pictures: null,
      date: 1481903962296,
      urls: [],
      userTake: [],
      given: false,
      userGiven: false,
      allreadyGiven: true,
      canEdit: false,
      canParticipate: true,
      canSuggest: true,
      comments: null,
      rating: 5
    },
    {
      id: 5066549580791808,
      listId: "cadeaux-noel",
      listTitle: null,
      owner: {
        email: "kieffersuzanne@gmail.com",
        name: "kieffersuzanne@gmail.com"
      },
      suggest: false,
      deleted: false,
      archived: false,
      label: "SPA gonflable",
      description: null,
      price: "3000",
      pictures: [
        "http://www.waterclip.fr/media/catalog/product/cache/2/image/9df78eab33525d08d6e5fb8d27136e95/_/1/_1010294_2.jpg"
      ],
      date: 1481904454372,
      urls: [],
      userTake: [{ name: "manu", email: "mail@mail.com" }],
      given: true,
      userGiven: true,
      allreadyGiven: false,
      canEdit: false,
      canParticipate: true,
      canSuggest: true,
      comments: null,
      rating: 4
    },
    {
      id: 5144752345317376,
      listId: "cadeaux-noel",
      listTitle: null,
      owner: { email: "kieffersuzanne@gmail.com", name: "kieffersuzanne" },
      suggest: true,
      deleted: false,
      archived: false,
      label: "SPA gonflable",
      description: null,
      price: "3000",
      pictures: [
        "http://www.waterclip.fr/media/catalog/product/cache/2/image/9df78eab33525d08d6e5fb8d27136e95/_/1/_1010294_2.jpg"
      ],
      date: 1481904454372,
      urls: [],
      userTake: [],
      given: false,
      userGiven: true,
      allreadyGiven: false,
      canEdit: false,
      canParticipate: true,
      canSuggest: true,
      comments: null,
      rating: 4
    },
    {
      id: 5348024557502464,
      listId: "cadeaux-noel",
      listTitle: null,
      owner: {
        email: "kieffersuzanne@gmail.com",
        name: "kieffersuzanne@gmail.com"
      },
      suggest: false,
      deleted: false,
      archived: false,
      label: "Billard américain",
      description: null,
      price: "1500",
      pictures: [
        "https://cdn.shopify.com/s/files/1/0177/9630/products/Billard_Club_Pro_KL0_10.jpg?v=1363879456"
      ],
      date: 1481904336625,
      urls: [],
      userTake: [],
      given: false,
      userGiven: false,
      allreadyGiven: false,
      canEdit: false,
      canParticipate: true,
      canSuggest: true,
      comments: [
        {
          date: "000000000000",
          text: "Commentaire",
          from: { name: "manu", email: "mail@mail.org" }
        },
        {
          date: "000000000000",
          text: "Commentaire",
          from: { name: "manu", email: "mail@mail.org" }
        }
      ],
      rating: 5
    },
    {
      id: 5707702298738688,
      listId: "cadeaux-noel",
      listTitle: null,
      owner: { email: "kieffersuzanne@gmail.com", name: "kieffersuzanne" },
      suggest: false,
      deleted: false,
      archived: false,
      label: "Vase soliflore",
      description: null,
      price: "30",
      pictures: [
        "http://www.lapadd.com/photos/2751/7301/237693/322481/mini-vase-soliflore-flower-loop-black-blum-groupe.800.jpg"
      ],
      date: 1481903650425,
      urls: null,
      userTake: [],
      given: false,
      userGiven: false,
      allreadyGiven: false,
      canEdit: false,
      canParticipate: true,
      canSuggest: true,
      comments: null,
      rating: 3
    },
    {
      id: 5910974510923776,
      listId: "cadeaux-noel",
      listTitle: null,
      owner: {
        email: "kieffersuzanne@gmail.com",
        name: "kieffersuzanne@gmail.com"
      },
      suggest: false,
      deleted: false,
      archived: false,
      label: "miss dior Blouming Bouquet",
      description: null,
      price: "60",
      pictures: [
        "http://www.sephora.fr/media/catalog_ProductCatalog/m11972145_P1714007_princ_medium.jpg"
      ],
      date: 1481904657207,
      urls: [
        {
          url:
            "http://www.origines-parfums.com/miss-dior-blooming-bouquet.htm?gclid=CjwKEAiAvs7CBRC24rao6bGCoiASJABaCt5DLSPU_Pg-5a8Xla1BXXjsVP7Agk07EO0hyyPOtDGeghoCKLXw_wcB",
          name: null
        }
      ],
      userTake: [],
      given: false,
      userGiven: false,
      allreadyGiven: false,
      canEdit: false,
      canParticipate: true,
      canSuggest: true,
      comments: [
        {
          date: "000000000000",
          text: "Commentaire",
          from: { name: "manu", email: "mail@mail.org" }
        },
        {
          date: "000000000000",
          text: "Commentaire",
          from: { name: "manu", email: "mail@mail.org" }
        },
        {
          date: "000000000000",
          text: "Commentaire",
          from: { name: "manu", email: "mail@mail.org" }
        },
        {
          date: "000000000000",
          text: "Commentaire",
          from: { name: "manu", email: "mail@mail.org" }
        },
        {
          date: "000000000000",
          text: "Commentaire",
          from: { name: "manu", email: "mail@mail.org" }
        },
        {
          date: "000000000000",
          text: "Commentaire",
          from: { name: "manu", email: "mail@mail.org" }
        }
      ],
      rating: 2
    },
    {
      id: 6270652252160000,
      listId: "cadeaux-noel",
      listTitle: null,
      owner: { email: "kieffersuzanne@gmail.com", name: "kieffersuzanne" },
      suggest: false,
      deleted: false,
      archived: false,
      label: "mugs à cocktail",
      description: null,
      price: "10",
      pictures: ["http://i.ebayimg.com/images/g/s9QAAOSwGWNUWdvp/s-l400.jpg"],
      date: 1481903786585,
      urls: [],
      userTake: [{ name: "manu", email: "mail@mail.com" }],
      given: true,
      userGiven: true,
      allreadyGiven: false,
      canEdit: false,
      canParticipate: true,
      canSuggest: true,
      comments: null,
      rating: 4
    }
  ];

  constructor(private demoStore: DemoStore) {}

  get() {}

  add(demos: WishItem[]) {
    this.demoStore.add(demos);
  }

  update(demos: WishItem[]) {
    this.demoStore.set(demos);
  }

  remove(id: ID) {
    this.demoStore.remove(id);
  }

  setWishList(wishList: WishList) {
    this.demoStore.update({ wishList });
  }

  public getWishForPrivacy(
    privacy: "PRIVATE" | "OPEN" | "PUBLIC",
    user: "OWNER" | "REGISTRER" | "PUBLIC" = "OWNER",
    forceAnonymous: boolean = false
  ) {
    return this.defaultWishs.reduce<WishItem[]>(
      (returnWishItems: WishItem[], wish: WishItem, index) => {
        const defaultConfig: WishItem = {};
        let displayItem: boolean = true;

        switch (user) {
          case "OWNER":
            defaultConfig.canParticipate = false;
            defaultConfig.canEdit = true;
            defaultConfig.canSuggest = false;
            defaultConfig.comments = null;
            switch (privacy) {
              case "OPEN":
                defaultConfig.userTake = [];
                defaultConfig.userGiven = false;
                defaultConfig.given = false;
                break;
              case "PRIVATE":
                defaultConfig.userTake = [];
                defaultConfig.userGiven = false;
                defaultConfig.given = false;
                break;
              case "PUBLIC":
                break;
            }

            if (forceAnonymous && wish.userGiven) {
              defaultConfig.userTake = [{ name: "anonymous" }];
              defaultConfig.userGiven = true;
              defaultConfig.given = true;
            }

            if (wish.suggest) {
              displayItem = false;
            }

            break;
          case "REGISTRER":
            defaultConfig.canParticipate = true;
            defaultConfig.canEdit = false;
            switch (privacy) {
              case "OPEN":
                break;
              case "PRIVATE":
                break;
              case "PUBLIC":
                displayItem = false;
                break;
            }
            break;
          case "PUBLIC":
            defaultConfig.canParticipate = false;
            defaultConfig.canEdit = false;
            defaultConfig.comments = null;
            switch (privacy) {
              case "OPEN":
                displayItem = false;
                break;
              case "PRIVATE":
                displayItem = false;
                break;
              case "PUBLIC":
                defaultConfig.userTake = [];
                defaultConfig.userGiven = false;
                defaultConfig.given = false;
                break;
            }
            break;
        }

        const updatedDefault = { ...wish, ...defaultConfig };

        if (displayItem) {
          returnWishItems.push(updatedDefault);
        }
        return returnWishItems;
      },
      []
    );
  }
}
